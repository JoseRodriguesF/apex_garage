document.addEventListener('DOMContentLoaded', () => {
    const email = sessionStorage.getItem('email');

    if (email) {
        fetch(`http://localhost:3000/api/usuario?email=${encodeURIComponent(email)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const nameUserElement = document.querySelector('.nameUser');
                    nameUserElement.textContent = `Olá, ${data.nome}`;

                    // Armazena o nome do usuário no sessionStorage
                    sessionStorage.setItem('nome', data.nome);
                } else {
                    console.error('Erro ao buscar o nome do usuário:', data.message);
                }
            })
            .catch(error => console.error('Erro:', error));
    } else {
        console.error('Email não encontrado no sessionStorage.');
    }
});