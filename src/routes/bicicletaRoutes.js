// src/routes/bicicletaRoutes.js
const express = require('express');
const router = express.Router();
const bicicletaController = require('../controllers/bicicletaController');

// Rotas para /api/bicicletas

// C - Create
router.post('/', bicicletaController.criarBicicleta);

// R - Read (All ou Filtrado por disponibilidade: /api/bicicletas?disponivel=true)
router.get('/', bicicletaController.listarBicicletas);

// R - Read (by ID)
router.get('/:id', bicicletaController.buscarBicicletaPorId);

// U - Update
router.put('/:id', bicicletaController.atualizarBicicleta);

// D - Delete
router.delete('/:id', bicicletaController.deletarBicicleta);

module.exports = router;