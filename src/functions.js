// functions.js
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dbPath = './db/users.json';

function readUsers() {
    try {
        const usersData = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(usersData);
    } catch (error) {
        console.error('Erro ao ler o arquivo de usuários: ', error);
        return [];
    }
}

function saveUsers(users) {
    console.log('Salvando usuários no arquivo JSON:', users);
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync(dbPath, data, 'utf-8');
}

module.exports = {
    readUsers,
    saveUsers,
};
