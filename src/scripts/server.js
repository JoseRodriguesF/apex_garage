// Requisições do Node.js
require('dotenv').config({ path: __dirname + '/../../config/.env' });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Importa o cookie-parser

// Iniciação do server.js
const app = express();
const porta = process.env.PORTA || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Adiciona o cookie-parser

// Importação das informações do DB presentes no .ENV
const banco = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME
}); 

// Verifica conexão com o banco
banco.connect(err => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err);
    }
    console.log('Conectado ao banco de dados MySQL');   
});

// Resgata os valores do formulário de registro 
app.get('/register', (req, res) => res.sendFile(`${__dirname}/register.html`));

// Resgata os valores do formulário de login
app.get('/login', (req, res) => res.sendFile(`${__dirname}/login.html`));

// Registro de usuários no banco
app.post('/register', (req, res) => {
    const { user, email, tel, senha, senha_confirm } = req.body;

    if (senha !== senha_confirm) {
        return res.status(400).send('As senhas não coincidem');
    }

    const verificaExistenciaUser = 'SELECT * FROM usuarios WHERE username = ? OR email = ?';
    banco.query(verificaExistenciaUser, [user, email], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao verificar o usuário');
        }

        if (results.length > 0) {
            return res.status(400).send('Usuário ou email já registrado');
        }

        const registroUser = 'INSERT INTO usuarios (username, email, telefone, senha) VALUES (?, ?, ?, ?)';
        banco.query(registroUser, [user, email, tel, senha], (err) => {
            if (err) {
                return res.status(500).send('Erro ao registrar o usuário');
            }
            res.send('Usuário registrado com sucesso!');
        });
    });
});

// Autenticação de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const verificaExistenciaUser = 'SELECT * FROM usuarios WHERE username = ?';
    banco.query(verificaExistenciaUser, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o usuário');
        }

        if (results.length === 0) {
            return res.status(400).send('Usuário não encontrado');
        }

        const user = results[0];

        if (password !== user.senha) {
            return res.status(400).send('Senha incorreta');
        }

        // Define um cookie de sessão
        res.cookie('username', user.username, { maxAge: 3600000 }); // 1 hora
        res.send('Login realizado com sucesso!');
    });
});

// Rota de serviços
app.get('/api/servicos', (req, res) => {
    const queryServicos = 'SELECT id, nome, descricao, preco FROM servicos';

    // Verifica se o usuário está autenticado
    if (!req.cookies.username) {
        return res.status(401).json({ message: 'Você precisa estar logado para acessar os serviços' });
    }

    banco.query(queryServicos, (err, results) => {
        if (err) {
            console.error('Erro ao buscar serviços:', err);
            return res.status(500).json({ message: 'Erro ao buscar serviços' });
        }
        res.json(results);
    });
});

// Rota de logout
app.post('/logout', (req, res) => {
    res.clearCookie('username'); // Limpa o cookie
    res.send('Logout realizado com sucesso!');
});

// Inicializar o servidor
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
