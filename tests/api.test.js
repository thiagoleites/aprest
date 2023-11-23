/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../src/app');

// // Função para gerar um número aleatório com a quantidade de dígitos informada
// function gemerateRandomNumber(digits) {
//     const min = 10 ** (digits - 1);
//     const max = 10 ** digits - 1;
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }

// // Função para gerar um e-mail aleatório
// function generateRandomEmail() {
//     const randomNumber = gemerateRandomNumber(6);
//     return `user${randomNumber}@example.com`;
// }

describe('User Register', () => {
    // const dinamicEmail = generateRandomEmail();
    it('should create a new user on /signup POST', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                nome: 'Test User',
                email: 'teste@example.com',
                senha: 'testpassword',
                telefones: [{ numero: '123456789', ddd: '11' }]
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('should return an error when trying to create a user without a password on /signup POST', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                nome: 'Test User',
                email: 'test@example.com',
                senha: '',
                telefones: [{ numero: '123456789', ddd: '11' }]
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('mensagem');
    });

    it('should return an error when trying to create a user with an existing email on /signup POST', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                nome: 'Test User',
                email: 'test@example.com',
                senha: 'testpassword',
                telefones: [{ numero: '123456789', ddd: '11' }]
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('mensagem');
    });
});

describe('User Login', () => {
    it('should return a token on /signin POST', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                email: 'test@example.com',
                senha: 'testpassword'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should be return error when user not found on /signin POST', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                email: 'onemail@test.com',
                senha: 'testpassword'
            });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('mensagem');
    });

    it('should return an error when trying to login with an invalid password on /signin POST', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                email: 'test@example.com',
                senha: 'invalidpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('mensagem');
    });
});

describe('User Profile', () => {
    let token;
    beforeAll(async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                email: 'test@example.com',
                senha: 'testpassword'
            });

        token = response.body.token;
        expect(response.status).toBe(200);
    });

    it('should get user profile on /user GET', async () => {
        const profileResponse = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${token}`);

        expect(profileResponse.body).toHaveProperty('email', 'test@example.com');
        expect(profileResponse.body).toHaveProperty('nome', 'Test User');
    });
});