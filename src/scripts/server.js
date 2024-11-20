
require('dotenv').config({ path: __dirname + '/../../config/.env' });
const express = require('express');
const cors = require('cors'); 
const mysql = require('mysql'); 
const bodyParser = require('body-parser'); 

const app = express(); 
const porta = process.env.PORTA || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static(__dirname + '/public/js/buscarServicos.js'));

const banco = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME
}); 

banco.connect(err => { 
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err);
    }
    console.log('Conectado ao banco de dados MySQL');   
});

app.get('/register', (req, res) => res.sendFile(`${__dirname}/registro.html`));

// Resgata os valores do formulário de login
app.get('/login', (req, res) => res.sendFile(`${__dirname}/login.html`));

app.post('/register', (req, res) => {
    const { nome, email, telefone, senha, confirmarSenha} = req.body;

    if (senha !== confirmarSenha) {
        return res.status(400).send('As senhas não coincidem');
    }

    const verificaExistenciaUser = 'SELECT * FROM usuarios WHERE nome = ? OR email = ?';
    banco.query(verificaExistenciaUser, [nome, email], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao verificar o usuário');
        }

        if (results.length > 0) {
            return res.status(400).send('Usuário ou email já registrado');
        }

        const registroUser = 'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)';
        banco.query(registroUser, [nome, email, telefone, senha], (err) => {
            if (err) {
                return res.status(500).send('Erro ao registrar o usuário');
            }
            res.json({ success: true, redirectUrl: '/src/pages/home.html' });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (email === 'admin@admin' && senha === 'admin') {
        return res.json({ success: true, redirectUrl: '/src/pages/admin.html' });
    }

    const verificaExistenciaUser  = 'SELECT * FROM usuarios WHERE email = ?';
    banco.query(verificaExistenciaUser , [email], (err, results) => {
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

        res.json({ success: true, redirectUrl: '/src/pages/home.html' });
    });
});

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

app.get('/api/servicos/usuario', (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório para acessar os serviços.' });
    }

    const query = 'SELECT * FROM servicos WHERE email = ?';
    banco.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erro ao buscar serviços:', err);
            return res.status(500).json({ message: 'Erro no servidor.' });
        }

        res.json(results); // Retorna os resultados da consulta
    });
});


app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});