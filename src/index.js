// src/index.js
require('dotenv').config();
const express = require('express');
const bicicletaRoutes = require('./routes/bicicletaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Aluguel de Bicicletas rodando com Express e Supabase!');
});

// Use as rotas de bicicletas
app.use('/api/bicicletas', bicicletaRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

