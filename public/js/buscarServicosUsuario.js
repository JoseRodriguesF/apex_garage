async function buscarServicosUsuario() {
    try {
        const response = await fetch('http://localhost:3000/api/servicos-usuario');
        
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.status}`);
        }

        const servicos = await response.json();

        const container = document.querySelector('.list-servicos-usuario');

        servicos.forEach(servico => {
            const servicoElement = document.createElement('tr');
            servicoElement.classList.add('servico');

            servicoElement.innerHTML = `
                <td class="td-body">${servico.id_servico}</td>
                <td class="td-body">${servico.nome}</td>
                <td class="td-body">${servico.servicos}</td>
                <td class="td-body">${servico.preco}</td>
            `;

            container.appendChild(servicoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar serviços do usuário:', error);
    }
}

// Carregar os serviços do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', buscarServicosUsuario);
