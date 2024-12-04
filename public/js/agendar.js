document.querySelector('.form-agenda').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recuperando valores dos campos do formulário
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const carBrand = document.getElementById('car-brand').value;

    // Recuperando valores do localStorage
    const servicoSelecionado = localStorage.getItem('servicoSelecionado');
    const emailUsuario = localStorage.getItem('email');
    const nomeUsuario = localStorage.getItem('nome');

    
    // Preenchendo os campos hidden com os dados do localStorage
    document.getElementById('email').value = emailUsuario;
    document.getElementById('nome').value = nomeUsuario;
    document.getElementById('servico').value = servicoSelecionado;
    
    console.log("Dados recuperados do localStorage:", { servicoSelecionado, emailUsuario, nomeUsuario });

        // Verificando se todos os dados necessários estão presentes
        if (!data || !hora || !carBrand || !servicoSelecionado || !emailUsuario || !nomeUsuario) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

    // Gerando o campo dataHora
    const dataHora = `${data} ${hora}:00`;

    // Dados a serem enviados no corpo da requisição
    const bodyData = {
        dataHora,
        carBrand,
        email: emailUsuario,
        nome: nomeUsuario,
        servico: servicoSelecionado
    };

    console.log("Dados a serem enviados para o backend:", bodyData);

    try {
        const response = await fetch('http://localhost:3000/agendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
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