// Função para buscar e exibir os serviços
async function buscarServicos() {
    try {
        const response = await fetch('http://localhost:3000/api/servicos');
        
        // Verifique o status da resposta
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.status}`);
        }

        const servicos = await response.json();

        console.log('Serviços recebidos:', servicos); // Log para ver os serviços recebidos

        const container = document.querySelector('.containerdeservicos');
        container.innerHTML = ''; // Limpar qualquer conteúdo pré-existente

        servicos.forEach(servico => {
            const servicoElement = document.createElement('div');
            servicoElement.classList.add('servico');

            servicoElement.innerHTML = `
                <h3>${servico.nome}</h3>
                <p>serviço: ${servico.servicos}</p>
                <p>Preço: R$${servico.preco.toFixed(2)}</p>
            `;

            container.appendChild(servicoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
    }
}

// Carregar os serviços ao carregar a página
document.addEventListener('DOMContentLoaded', buscarServicos);
