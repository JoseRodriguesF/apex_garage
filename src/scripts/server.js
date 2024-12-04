
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

        res.json({ success: true, redirectUrl: '/src/pages/user.html' });
    });
});

app.get('/api/servicos', (req, res) => {
    const queryServicos = `SELECT id_servico, nome, servicos, preco 
                           FROM servicos 
                           ORDER BY FIELD(preco, 'R$ 4.000', 'R$ 2.500', 'R$ 1.000', 'R$ 600', 'R$ 500', 'R$ 350', 'R$ 300', 'R$ 200', 'R$ 150')`;
    
    banco.query(queryServicos, (err, results) => {
        if (err) {
            console.error('Erro ao buscar serviços:', err);
            return res.status(500).json({ message: 'Erro ao buscar serviços' });
        }
        res.json(results);
    });
});

app.get('/api/historico', (req, res) => {
    const queryHistorico = `SELECT id, nome, servicos, preco 
                            FROM historico 
                            ORDER BY FIELD(preco, 'R$ 4.000', 'R$ 2.500', 'R$ 1.000', 'R$ 600', 'R$ 500', 'R$ 350', 'R$ 300', 'R$ 200', 'R$ 150')`;
    
    banco.query(queryHistorico, (err, results) => {
        if (err) {
            console.error('Erro ao buscar histórico:', err);
            return res.status(500).json({ message: 'Erro ao buscar histórico' });
        }
        res.json(results); // Envia os resultados como JSON
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

app.delete('/api/excluirServico/:id', (req, res) => {
    const { id } = req.params;

    // Mover o serviço para a tabela 'historico'
    const moverParaHistorico = `
        INSERT INTO historico (id_servico, nome, servicos, preco, email)
        SELECT id_servico, nome, servicos, preco, email FROM servicos WHERE id_servico = ?;
    `;
    banco.query(moverParaHistorico, [id], (err, result) => {
        if (err) {
            console.error('Erro ao mover para histórico:', err);
            return res.status(500).json({ message: 'Erro ao mover para histórico' });
        }

        // Excluir o serviço da tabela 'servicos'
        const excluirServico = 'DELETE FROM servicos WHERE id_servico = ?';
        banco.query(excluirServico, [id], (err) => {
            if (err) {
                console.error('Erro ao excluir o serviço:', err);
                return res.status(500).json({ message: 'Erro ao excluir o serviço' });
            }
            res.status(200).json({ message: 'Serviço movido e excluído com sucesso' });
        });
    });
});

app.get('/api/usuario', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email não fornecido' });
    }

    const query = 'SELECT nome FROM usuarios WHERE email = ?';
    banco.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar o nome do usuário' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        res.json({ success: true, nome: results[0].nome });
    });
});

app.post('/agendar', (req, res) => {
    console.log('Corpo da requisição:', req.body); // Verifique se os dados estão chegando corretamente

    const { dataHora, carBrand, email, nome, servico } = req.body;

    if (!dataHora || !carBrand || !email || !nome || !servico) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    const sql = 'INSERT INTO servicos (data_hora, veiculo, nome, email, servico) VALUES (?, ?, ?, ?, ?)';

    banco.query(sql, [dataHora, carBrand, nome, email, servico], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar o agendamento' });
        }

        console.log('Agendamento registrado:', result);
        res.status(200).json({ success: true, message: 'Agendamento realizado com sucesso!' });
    });
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});