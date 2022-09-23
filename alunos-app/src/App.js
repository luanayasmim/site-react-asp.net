import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DataTable from 'react-data-table-component';


function App() {

  const baseUrl = "https://localhost:44356/api/aluno";
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
        setFilter(response.data);
      }).catch(error => console.log(error));
  }

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData]);
  useEffect(()=>{
    const result = data.filter(aluno=>{
      return aluno.nome.toLowerCase().match(search.toLowerCase());
    });

    setFilter(result);
  },[search])

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado,
      [name]: value
    });
    console.log(alunoSelecionado);
  }

  const [modalIncluir, setModalIncluir] = useState(false);

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const pedidoPost = async () => {
    delete alunoSelecionado.id;
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);

    await axios.post(baseUrl, alunoSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => console.log(error));
  }

  const [modalEditar, setModalEditar] = useState(false);

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    opcao === 'Editar' ? abrirFecharModalEditar() : abrirFecharModalDelete();
    //(opcao==='Editar') && abrirFecharModalEditar();
  }

  const pedidoPut = async () => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(`${baseUrl}/${alunoSelecionado.id}`, alunoSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(aluno => {
          if (aluno.id === alunoSelecionado.id) {
            aluno.nome = resposta.nome;
            aluno.email = resposta.email;
            aluno.idade = resposta.idade;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      }).catch(error => console.log(error));
  }

  const [modalDelete, setModalDelete] = useState(false);

  const abrirFecharModalDelete = () => {
    setModalDelete(!modalDelete);
  }

  const pedidoDelete = () => {
    axios.delete(baseUrl + '/' + alunoSelecionado.id)
      .then(response => {
        setData(data.filter(aluno => aluno.id !== response.data));
        setUpdateData(true);
        abrirFecharModalDelete();
      }).catch(error => console.log(error));
  }

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true
    },
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true
    },
    {
      name: "Idade",
      selector: (row) => row.idade,
      sortable: true
    },
    {
      name: "Action",
      cell: row => <div class="btn-group" role="group">
        <button className='btn btn-dark' onClick={() => selecionarAluno(row, "Editar")}>Editar</button>
        <button className='btn btn-danger' onClick={() => selecionarAluno(row, "Apagar")}>Apagar</button>
      </div>
    }
  ]

  return (
    <div className="App">
      <br />
      <header>
        <h1>Cadastro de Alunos</h1>
        {/* <div class="d-grid gap-2 d-md-flex justify-context-md-start">
          <button className='btn btn-success' onClick={() => abrirFecharModalIncluir()}>Incluir novo aluno</button>

        </div> */}
      </header>
      {/* <table className='table table-bodered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Exibir os dados 
          {data.map(aluno => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className='btn btn-dark' onClick={() => selecionarAluno(aluno, "Editar")}>Editar</button>
                <button className='btn btn-danger' onClick={() => selecionarAluno(aluno, "Apagar")}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <DataTable 
        columns={columns} 
        data={filter} 
        pagination 
        fixedHeader 
        fixedHeaderScrollHeight='450px' 
        selectableRowsHighlight 
        highlightOnHover 
        actions={
          <input type='text' className='w-25 form-control' value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Pesquisar"/>
        }
        subHeader
        subHeaderComponent={
          <button className='btn btn-success' onClick={() => abrirFecharModalIncluir()}>Incluir novo aluno</button>
        }
        subHeaderAlign="left"
        />

      {/* Modal Create */}
      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Alunos</ModalHeader>

        <ModalBody>
          <div className='form-group'>
            <label>Nome: </label>
            <input type='text' className='form-control' name='nome' onChange={handleChange} />
            <label>Email: </label>
            <input type='text' className='form-control' name='email' onChange={handleChange} />
            <label>Idade: </label>
            <input type='text' className='form-control' name='idade' onChange={handleChange} />
          </div>
        </ModalBody>

        <ModalFooter>
          <button className='btn btn-success' onClick={() => pedidoPost()}>Incluir</button>
          <button className='btn btn-secondary' onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Modal Update */}
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Aluno</ModalHeader>

        <ModalBody>
          <div className='form-group'>
            <label>Id:</label>
            <input type='text' className='form-control' name='id' readOnly value={alunoSelecionado && alunoSelecionado.id} />

            <label>Nome: </label>
            <input type='text' className='form-control' name='nome' onChange={handleChange} value={alunoSelecionado && alunoSelecionado.nome} />
            <label>Email: </label>
            <input type='text' className='form-control' name='email' onChange={handleChange} value={alunoSelecionado && alunoSelecionado.email} />
            <label>Idade: </label>
            <input type='text' className='form-control' name='idade' onChange={handleChange} value={alunoSelecionado && alunoSelecionado.idade} />
          </div>
        </ModalBody>

        <ModalFooter>
          <button className='btn btn-success' onClick={() => pedidoPut()}>Editar</button>
          <button className='btn btn-secondary' onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Modal para apagar  */}
      <Modal isOpen={modalDelete}>
        <ModalBody>
          Tem certeza que deseja apagar {alunoSelecionado && alunoSelecionado.nome} da lista de alunos?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={() => pedidoDelete()}>Apagar</button>
          <button className='btn btn-secondary' onClick={() => abrirFecharModalDelete()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
