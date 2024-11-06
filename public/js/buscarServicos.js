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
                        <td style="background-color: #352335;">${servico.id_servico}</td>
                        <td style="background-color: #352335;">${servico.nome}</td>
                        <td style="background-color: #352335;">${servico.servicos}</td>
                        <td style="background-color: #352335;">${servico.preco}</td>
                        <td><button style="background-color: #353535;"><img src="/public/images/Ícones/mail.svg" alt=""></button></td>
            `;

            container.appendChild(servicoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
    }
}

// Carregar os serviços ao carregar a página
document.addEventListener('DOMContentLoaded', buscarServicos);
