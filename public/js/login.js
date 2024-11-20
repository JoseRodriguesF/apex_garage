document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Salva apenas o email no sessionStorage
            sessionStorage.setItem('email', email);
            
            // Redireciona para a página user.html
            window.location.href = 'user.html';
        } else {
            alert('Erro: ' + (data.message || 'Falha no login'));
        }
    })
    .catch(error => console.error('Erro:', error));
});