require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readUsers, saveUsers } = require('./functions');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

router.post('/signup', async (req, res) => {
    try {
        const { nome, email, senha, telefones } = req.body;
        const users = readUsers();

        if (!nome || !email || !senha || !telefones) {
            return res.status(400).json({ mensagem: 'Dados inválidos' });
        }
        
        if (users.some(user => user.email === email)) {
            return res.status(400).json({ mensagem: 'E-mail já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = {
            id: uuidv4(), 
            nome,
            email,
            senha: hashedPassword,
            telefones,
            data_criacao: new Date(),
            data_atualizacao: new Date(),
            ultimo_login: null, 
        };

        users.push(newUser);
        saveUsers(users);

        const token = jwt.sign({ userId: newUser.id }, TOKEN_SECRET, { expiresIn: '30m'});
        
        res.status(201).json({
            id: newUser.id,
            data_criacao: newUser.data_criacao,
            data_atualizacao: newUser.data_atualizacao,
            ultimo_login: newUser.ultimo_login,
            token: token,
        });
    } catch (error) {
        console.error('Erro: ', error);
        res.status(500).json({ mensagem: 'Erro no servidor' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const users = readUsers();
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if (!isPasswordValid) {
            return res.status(401).json({ mensagem: 'Senha incorreta' });
        }

        user.ultimo_login = new Date();

        saveUsers(users);

        const token = jwt.sign({ userId: user.id }, TOKEN_SECRET, { expiresIn: '30m'});
        
        user.token = token;

        res.json({ token });
    } catch (error) {
        console.error('Erro: ', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

router.get('/user', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({mensagem: 'Token não fornecido'});
        }

        const decode = await jwt.verify(token, TOKEN_SECRET);

        if(decode === undefined) {
            return res.status(401).json({mensagem: 'Não autorizado'});
        }

        const users = readUsers();
        const user = users.find(user => user.id === decode.userId);

        if (!user) {
            return res.status(401).json({mensagem: 'Não autorizado'});
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log('Erro ao verficar o token: ', error);
        res.status(401).json({mensagem: 'Não autorizado'});
    }
});

module.exports = router;