// Função para buscar e exibir os serviços do usuário
async function buscarServicosUsuario() {
    try {
        const email = sessionStorage.getItem('email'); // Obtém o email do usuário logado

        // Faz a requisição para a rota de serviços filtrados
        const response = await fetch(`http://localhost:3000/api/servicos/usuario?email=${encodeURIComponent(email)}`);
        
        // Verifica se a resposta da rede foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.status}`);
        }

        // Obtém os dados em formato JSON
        const servicos = await response.json();

        console.log('Serviços recebidos:', servicos); // Log para depuração

        // Seleciona o container para exibir os serviços
        const container = document.querySelector('.list-servicos-usuario');
        container.innerHTML = ''; // Garante que o container seja limpo antes de exibir novos serviços

        // Itera sobre os serviços e cria elementos para exibição
        servicos.forEach(servico => {
            const servicoElement = document.createElement('tr');
            servicoElement.classList.add('servico');

            const dataHoraFormatada = new Date(servico.data_hora).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
            });

            // Preenche o HTML de cada linha com as informações do serviço
            servicoElement.innerHTML = `
                <td class="td-body">${servico.servicos}</td>
                <td class="td-body">${servico.preco}</td>
                <td class="td-body">${dataHoraFormatada}</td>
            `;

            container.appendChild(servicoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar serviços do usuário:', error);
    }
}

// Carrega os serviços do usuário assim que a página for carregada
document.addEventListener('DOMContentLoaded', buscarServicosUsuario);