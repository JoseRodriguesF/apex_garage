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

        const container = document.querySelector('.list-services');
        // container.innerHTML = ''; // Limpar qualquer conteúdo pré-existente

        servicos.forEach(servico => {
            const servicoElement = document.createElement('tr');
            servicoElement.classList.add('servico');

            servicoElement.innerHTML = `
                        <td class="td-body">${servico.id_servico}</td>
                        <td class="td-body">${servico.nome}</td>
                        <td class="td-body">${servico.servicos}</td>
                        <td class="td-body">${servico.preco}</td>
                        <td class="td-body"><button class="button-img-check"><img class="check-services" src="/public/images/ícones/circle-check-regular.svg" alt="check"></img></button></td>
            `;

            container.appendChild(servicoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
    }
}

// Carregar os serviços ao carregar a página
document.addEventListener('DOMContentLoaded', buscarServicos);
