using AlunosApi.Context;
using AlunosApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlunosApi.Services
{
    public class AlunoService : IAlunoService
    {
        private readonly AppDbContext _dbContext;
        public AlunoService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Aluno>> GetAlunos()
        {
            try
            {
                return await _dbContext.Alunos.ToListAsync();
            }
            catch (Exception err)
            {
                Console.WriteLine(err);
                throw;
            }
        }

        public async Task<Aluno> GetAluno(int id)
        {
            var aluno = await _dbContext.Alunos.FindAsync(id);
            return aluno;
        }
        public async Task<IEnumerable<Aluno>> GetAlunosByName(string name)
        {
            IEnumerable<Aluno> alunos;
            if (!string.IsNullOrEmpty(name))
            {
                alunos = await _dbContext.Alunos.Where(x => x.Nome.Contains(name)).ToListAsync();
            }
            else
            {
                return await GetAlunos();
            }
            return alunos;
        }

        public async Task PostAluno(Aluno aluno)
        {
            _dbContext.Alunos.Add(aluno);
            await _dbContext.SaveChangesAsync();
        }

        public async Task PutAluno(Aluno aluno)
        {
            _dbContext.Entry(aluno).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAluno(Aluno aluno)
        {
            _dbContext.Alunos.Remove(aluno);
            await _dbContext.SaveChangesAsync();
        }
    }
}
