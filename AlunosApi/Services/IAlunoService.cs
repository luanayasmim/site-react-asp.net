using AlunosApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlunosApi.Services
{
    public interface IAlunoService
    {
        Task<IEnumerable<Aluno>> GetAlunos();
        Task<Aluno> GetAluno(int id);
        Task<IEnumerable<Aluno>> GetAlunosByName(string name);

        Task PostAluno(Aluno aluno);
        Task PutAluno(Aluno aluno);
        Task DeleteAluno(Aluno aluno);
    }
}
