using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AlunosApi.Models
{
    public class Aluno
    {
        [Required]
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="O nome não pode ser nulo!")]
        [StringLength(100, ErrorMessage ="O tamanho máximo permitido é de até 100 caracteres.")]
        public string Nome { get; set; }
        [Required(ErrorMessage ="O email não pode ser nulo!")]
        [EmailAddress(ErrorMessage ="Informe um enderenço de e-mail válido!")]
        [StringLength(80, ErrorMessage ="O tamanho máximo permitido é de até 80 caracteres.")]
        public string Email { get; set; }
        [Required(ErrorMessage ="A idade não pode ser nula!")]
        public int Idade { get; set; }
    }
}
