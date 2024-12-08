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

        servicos.forEach(servico => {
            const servicoElement = document.createElement('tr');
            servicoElement.classList.add('servico');

            const dataHoraFormatada = new Date(servico.data_hora).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
            });

            servicoElement.innerHTML = `
                <td class="td-body">${servico.id_servico}</td>
                <td class="td-body">${servico.nome}</td>
                <td class="td-body">${servico.veiculo}</td>
                <td class="td-body">${servico.servicos}</td>
                <td class="td-body">${servico.preco}</td>
                <td class="td-body">${dataHoraFormatada}</td>
                <td class="td-body">
                    <button class="button-img-check">
                        <img class="check-services" src="/public/images/ícones/circle-check-regular.svg" alt="check">
                    </button>
                </td>
            `;
            
            container.appendChild(servicoElement);

            // Adicionar event listener para o botão de check
            const checkButton = servicoElement.querySelector('.button-img-check');
            checkButton.addEventListener('click', async () => {
                try {
                    const serviceId = servico.id_servico;
                    const response = await fetch(`http://localhost:3000/api/excluirServico/${serviceId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        servicoElement.remove();
                    } else {
                        alert('Erro ao excluir o serviço.');
                    }
                } catch (error) {
                    console.error('Erro ao excluir serviço:', error);
                    alert('Erro ao tentar excluir o serviço.');
                }
            });
        });
    } catch (error) {
        console.error('Erro ao buscar os serviços:', error);
        alert('Erro ao buscar os serviços.');
    }
}

// Carregar os serviços ao carregar a página
document.addEventListener('DOMContentLoaded', buscarServicos);
