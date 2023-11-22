// app.js
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
