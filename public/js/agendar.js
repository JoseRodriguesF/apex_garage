document.querySelector('.form-agenda').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const carBrand = document.getElementById('car-brand').value;
    const servicoSelecionado = sessionStorage.getItem('servicoSelecionado');
    const emailUsuario = sessionStorage.getItem('email');
    const nomeUsuario = sessionStorage.getItem('nome');

    if (!data || !hora || !carBrand) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const dataHora = `${data} ${hora}:00`;

    try {
        const response = await fetch('http://localhost:3000/agendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dataHora,  // Envie o campo dataHora concatenado
                carBrand,
                email: emailUsuario,
                nome: nomeUsuario,
                servico: servicoSelecionado
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Agendamento realizado com sucesso!');
            location.href = '/src/pages/home.html';
        } else {
            alert(result.message || 'Erro ao realizar o agendamento.');
        }
    } catch (error) {
        console.error('Erro ao enviar agendamento:', error);
        alert('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    }
});