require('dotenv').config({ path: __dirname + '/../../config/.env' });
const express = require('express');
const cors = require('cors'); 
const mysql = require('mysql'); 
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); 

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contato.apex.garage.br@gmail.com', 
        pass: 'oxpa phii nqvc rsyl' 
    }
});

app.post('/enviar-email', (req, res) => {
    const { nome, email, mensagem } = req.body;
    const mailOptions = {
        from: email,
        to: 'contato.apex.garage.br@gmail.com',
        subject: `Mensagem de ${nome}`,
        text: `
        Mensagem: ${mensagem}
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar o e-mail:', error);
            return res.status(500).json({ success: false, message: 'Erro ao enviar o e-mail.' });
        }
    });
});

banco.connect(err => { 
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err);
    }
    console.log('Conectado ao banco de dados MySQL');   
});

app.get('/register', (req, res) => res.sendFile(`${__dirname}/registro.html`));

app.get('/login', (req, res) => res.sendFile(`${__dirname}/login.html`));

app.post('/register', (req, res) => {
    const { nome, email, senha, confirmarSenha} = req.body;

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

        const registroUser = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        banco.query(registroUser, [nome, email, senha], (err) => {
            if (err) {
                return res.status(500).send('Erro ao registrar o usuário');
            }
            res.json({ success: true, redirectUrl: '/src/pages/login.html' });
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
    const queryServicos = `SELECT id_servico, nome, servicos, preco, veiculo, data_hora
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
    const queryHistorico = `SELECT id, nome, servicos, preco, data_hora, veiculo
                            FROM historico 
                            ORDER BY FIELD(preco, 'R$ 4.000', 'R$ 2.500', 'R$ 1.000', 'R$ 600', 'R$ 500', 'R$ 350', 'R$ 300', 'R$ 200', 'R$ 150')`;
    
    banco.query(queryHistorico, (err, results) => {
        if (err) {
            console.error('Erro ao buscar histórico:', err);
            return res.status(500).json({ message: 'Erro ao buscar histórico' });
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

        res.json(results); 
    });
});

app.delete('/api/excluirServico/:id', (req, res) => {
    const { id } = req.params;

    const moverParaHistorico = `
        INSERT INTO historico (id_servico, nome, servicos, preco, email, veiculo, data_hora)
        SELECT id_servico, nome, servicos, preco, email, veiculo, data_hora FROM servicos WHERE id_servico = ?;
    `;
    banco.query(moverParaHistorico, [id], (err, result) => {
        if (err) {
            console.error('Erro ao mover para histórico:', err);
            return res.status(500).json({ message: 'Erro ao mover para histórico' });
        }

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
    console.log('Corpo da requisição:', req.body);

    const { data, hora, carBrand, email, nome, servico } = req.body;

    const dataHora = `${data} ${hora}`;

    const servicoPrecos = {
        'Troca de Bateria': 'R$ 600',
        'Troca de Óleo': 'R$ 350',
        'Diagnóstico': 'R$ 200',
        'Revisão e Inspeção': 'R$ 500',
        'Retífica': 'R$ 4.000',
        'Caixa de Direção': 'R$ 2.500',
        'Troca de Filtro de Ar': 'R$ 150',
        'Troca de Pneus': 'R$ 200',
        'Amortecedores': 'R$ 300',
        'Escapamento': 'R$ 1.000'
    };

    if (!dataHora || !carBrand || !email || !nome || !servico) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    const preco = servicoPrecos[servico];
    if (!preco) {
        return res.status(400).json({ success: false, message: 'Serviço inválido' });
    }

    const sql = 'INSERT INTO servicos (data_hora, veiculo, nome, email, servicos, preco) VALUES (?, ?, ?, ?, ?, ?)';

    banco.query(sql, [dataHora, carBrand, nome, email, servico, preco], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar o agendamento' });
        }

    });
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});