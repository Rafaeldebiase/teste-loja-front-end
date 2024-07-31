export interface ICliente {
    nomeRazaoSocial: string,
    email: string,
    telefone: string,
    tipoPessoa: string,
    documento: string,
    isentoInscricaoEstadual: boolean,
    inscricaoEstadual: string,
    genero: string,
    dataNascimento: Date,
    bloqueado: boolean,
    senha: string,
    inscricaoEstadualPessoaFisica: boolean
}