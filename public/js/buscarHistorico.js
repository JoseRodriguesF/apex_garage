async function buscarHistorico() {
    try {
        // Faz a requisição para a rota de histórico
        const response = await fetch(`http://localhost:3000/api/historico`);
        
        // Verifica se a resposta da rede foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.status}`);
        }

        // Obtém os dados em formato JSON
        const historicoData = await response.json();

        console.log('Histórico de serviços recebidos:', historicoData); // Log para depuração

        // Seleciona o container para exibir os serviços
        const container = document.querySelector('.list-services');
        container.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

        // Itera sobre os serviços e cria elementos para exibição
        historicoData.forEach(item => {
            const historicoElement = document.createElement('tr');
            historicoElement.classList.add('servico');

            // Preenche o HTML de cada linha com as informações do histórico
            historicoElement.innerHTML = `
                <td class="td-body">${item.id}</td>
                <td class="td-body">${item.nome}</td>
                <td class="td-body">${item.servicos}</td>
                <td class="td-body">${item.preco}</td>
            `;

            container.appendChild(historicoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar histórico de serviços:', error);
    }
}

document.addEventListener('DOMContentLoaded', buscarHistorico);
