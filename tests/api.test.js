/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../src/app');

describe('User Register', () => {
    it('should create a new user on /signup POST', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                nome: 'Test User',
                email: 'test@example.com',
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
        // expect(response.body).toHaveProperty('mensagem');
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
