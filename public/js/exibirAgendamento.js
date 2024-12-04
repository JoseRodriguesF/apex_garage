document.addEventListener('DOMContentLoaded', () => {
    const servicoSelecionado = sessionStorage.getItem('servicoSelecionado');
    if (servicoSelecionado) {
        document.querySelector('.service').textContent = servicoSelecionado;
    }
});