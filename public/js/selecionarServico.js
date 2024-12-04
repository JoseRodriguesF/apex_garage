function selecionarServico(servico) {
    sessionStorage.setItem('servicoSelecionado', servico);
    location.href = '/src/pages/agendamento.html';
}