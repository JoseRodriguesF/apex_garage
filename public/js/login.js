document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Envia a requisição POST com os dados de login
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do servidor:', data); // Adicionado para depuração
        if (data.success) {
            // Redireciona para index.html se o login for bem-sucedido
            window.location.href = data.redirectUrl;
        } else {
            // Exibe uma mensagem de erro se o login falhar
            alert('Erro: ' + (data.message || 'Falha no login'));
        }
    })
    .catch(error => console.error('Erro:', error));
});
