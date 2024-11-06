// Requisições do Node.js
require('dotenv').config({ path: __dirname + '/../../config/.env' });// Puxa as variáveis presentes no .ENV
const express = require('express'); // Importa o express para facilitar as conexões e requisições HTTP
const cors = require('cors'); // Importa o cors
const mysql = require('mysql'); // Importa o módulo de conexão MySQL
const bodyParser = require('body-parser'); // Body parser ajuda a extrair as informações presentes nos arquivos JSON

// Iniciação do server.js
const app = express(); // Adiciona os valores do express na variável app
const porta = process.env.PORTA || 3000; // Variável que puxa do .ENV a porta do server.js ou armazena o valor da porta onde o server.js rodará 

// Middleware
app.use(cors()); // Habilita o CORS para todas as origens
app.use(bodyParser.urlencoded({ extended: true })); // Usar os valores de express para manipulação de HTTP e body parser para ler URL codificada
app.use(bodyParser.json()); // Usa os valores de body parser para ler valores JSON
app.use(express.static(__dirname + '/public/js/buscarServicos.js'));


// Importação das informações do DB presentes no .ENV
const banco = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME
}); 

// Verifica conexão com o banco
banco.connect(err => { // err é um valor que representa um erro na conexão 
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err);
    }
    console.log('Conectado ao banco de dados MySQL');   
});

// Resgata os valores do formulário de registro 
app.get('/register', (req, res) => res.sendFile(`${__dirname}/registro.html`));

// Resgata os valores do formulário de login
app.get('/login', (req, res) => res.sendFile(`${__dirname}/login.html`));

// Registro de usuários no banco
app.post('/register', (req, res) => {
    const { nome, email, telefone, senha, confirmarSenha} = req.body;

    // Verificar se a senha e a confirmação de senha estão iguais
    if (senha !== confirmarSenha) {
        return res.status(400).send('As senhas não coincidem');
    }

    // Verificar se o usuário já existe no banco
    const verificaExistenciaUser = 'SELECT * FROM usuarios WHERE nome = ? OR email = ?';
    banco.query(verificaExistenciaUser, [nome, email], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao verificar o usuário');
        }

        if (results.length > 0) {
            return res.status(400).send('Usuário ou email já registrado');
        }

        // Registrar o usuário 
        const registroUser = 'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)';
        banco.query(registroUser, [nome, email, telefone, senha], (err) => {
            if (err) {
                return res.status(500).send('Erro ao registrar o usuário');
            }
            res.json({ success: true, redirectUrl: '/src/pages/home.html' });
        });
    });
});


// Autenticação de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const verificaExistenciaUser = 'SELECT * FROM usuarios WHERE email = ?';
    banco.query(verificaExistenciaUser, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar o usuário' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado' });
        }

        const user = results[0];

        if (senha !== user.senha) {
            return res.status(400).json({ success: false, message: 'Senha incorreta' });
        }

        // Se tudo estiver correto, redirecione
        res.json({ success: true, redirectUrl: '/src/pages/home.html' });
    });
});
// resgata as informações de serviço
app.get('/api/servicos', (req, res) => {
    const queryServicos = 'SELECT id_servico, nome, servicos, preco FROM servicos';
    
    banco.query(queryServicos, (err, results) => {
        if (err) {
            console.error('Erro ao buscar serviços:', err);
            return res.status(500).json({ message: 'Erro ao buscar serviços' });
        }
        res.json(results);
    });
});

// Inicializar o servidor
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});