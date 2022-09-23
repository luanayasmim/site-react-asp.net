using AlunosApi.Models;
using AlunosApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlunosApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlunoController : ControllerBase
    {
        private IAlunoService _alunoService;

        public AlunoController(IAlunoService alunoService)
        {
            _alunoService = alunoService;
        }

        [HttpGet]
        public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetAlunos() 
        {
            try
            {
                var alunos = await _alunoService.GetAlunos();
                return Ok(alunos);
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err);
                throw;
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Aluno>> GetAluno(int id)
        {
            try
            {
                var aluno = await _alunoService.GetAluno(id);

                if (aluno == null)
                    return NotFound($"Não existem resgitros com o id: {id}");

                return Ok(aluno);
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err);
                throw;
            }
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetAlunoByName(string name)
        {
            try
            {
                var alunos = await _alunoService.GetAlunosByName(name);

                if (alunos.Count() == 0)  return NotFound($"Não foi encontrado nunhum aluno com o nome {name}"); 
                
                return Ok(alunos);

            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err);
                throw;
            }
        }

        [HttpPost]
        public async Task<ActionResult> Create(Aluno aluno)
        {
            try
            {
                await _alunoService.PostAluno(aluno);
                return Ok("Cadastro feito com sucesso!");
                //return CreatedAtRoute(nameof(GetAluno), new { id = aluno.Id }, aluno);
            }
            catch (Exception err)
            {
                return BadRequest(err);
                throw;
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update(int id, [FromBody] Aluno aluno)
        {
            try
            {
                if (aluno.Id == id)
                {
                    await _alunoService.PutAluno(aluno);
                    return Ok($"Aluno com o id={id} foi atualizado com sucesso");
                }
                else
                {
                    return BadRequest("Id não encontrado");
                }
            }
            catch (Exception err)
            {
                return BadRequest(err);
                throw;
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var aluno = await _alunoService.GetAluno(id);
                if (aluno != null)
                {
                   await _alunoService.DeleteAluno(aluno);
                    return Ok($"Aluno de id={id} foi apagado com sucesso!");
                }
                else
                {
                    return NotFound($"O aluno com o id{id} não foi encontrado");
                }
            }
            catch (Exception err)
            {
                return BadRequest(err);
                throw;
            }
        }
    }
}
