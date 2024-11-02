function confirmarSenha() {
    // Obtenha os valores dos campos de senha
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const errorMessage = document.getElementById("error-message");

    // Verifique se as senhas coincidem
    if (senha !== confirmarSenha) {
        // Exiba a mensagem de erro
        errorMessage.style.display = "block";
    } else {
        // Oculte a mensagem de erro e prossiga com o envio do formulário
        errorMessage.style.display = "none";
        alert("Conta criada com sucesso!");
        // Aqui você pode adicionar a lógica para enviar o formulário
    }
}