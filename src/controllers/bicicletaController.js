// src/controllers/bicicletaController.js
const supabase = require('../config/supabase');
const NOME_TABELA = 'bicicletas';

// R1: Listar todas as bicicletas (ou filtrar por disponibilidade)
exports.listarBicicletas = async (req, res) => {
    // Roteiro Extra: Filtro por bicicletas disponíveis
    const { disponivel } = req.query; // Pega o query param ?disponivel=true

    try {
        let query = supabase.from(NOME_TABELA).select('*');

        if (disponivel !== undefined) {
            // Converte a string "true" ou "false" para booleano
            const isDisponivel = disponivel.toLowerCase() === 'true';
            query = query.eq('disponivel', isDisponivel);
        }

        const { data: bicicletas, error } = await query;

        if (error) throw error;
        
        res.status(200).json(bicicletas);
    } catch (error) {
        console.error("Erro ao listar bicicletas:", error.message);
        res.status(500).json({ erro: 'Erro interno do servidor ao listar bicicletas.' });
    }
};

// R2: Buscar bicicleta por ID (Read by ID)
exports.buscarBicicletaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const { data: bicicleta, error } = await supabase
            .from(NOME_TABELA)
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (!bicicleta) {
            return res.status(404).json({ erro: 'Bicicleta não encontrada.' });
        }
        
        res.status(200).json(bicicleta);
    } catch (error) {
        console.error(`Erro ao buscar bicicleta ${id}:`, error.message);
        res.status(500).json({ erro: 'Erro interno do servidor ao buscar bicicleta.' });
    }
};

// C: Criar nova bicicleta (Create)
exports.criarBicicleta = async (req, res) => {
    const novaBicicleta = req.body;
    try {
        const { data, error } = await supabase
            .from(NOME_TABELA)
            .insert([novaBicicleta])
            .select();
            
        if (error) throw error;

        res.status(201).json(data[0]); 
    } catch (error) {
        console.error("Erro ao criar bicicleta:", error.message);
        res.status(500).json({ erro: 'Erro interno do servidor ao criar bicicleta.' });
    }
};

// U: Atualizar bicicleta (Update)
exports.atualizarBicicleta = async (req, res) => {
    const { id } = req.params;
    const atualizacoes = req.body;
    try {
        const { data, error } = await supabase
            .from(NOME_TABELA)
            .update(atualizacoes)
            .eq('id', id)
            .select();
            
        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ erro: 'Bicicleta não encontrada para atualização.' });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.error(`Erro ao atualizar bicicleta ${id}:`, error.message);
        res.status(500).json({ erro: 'Erro interno do servidor ao atualizar bicicleta.' });
    }
};

// D: Deletar bicicleta (Delete)
exports.deletarBicicleta = async (req, res) => {
    const { id } = req.params;
    try {
        // Verifica se existe antes de deletar
        const { data: existente } = await supabase
            .from(NOME_TABELA)
            .select('id')
            .eq('id', id);

        if (!existente || existente.length === 0) {
            return res.status(404).json({ erro: 'Bicicleta não encontrada para deleção.' });
        }
        
        const { error } = await supabase
            .from(NOME_TABELA)
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();
    } catch (error) {
        console.error(`Erro ao deletar bicicleta ${id}:`, error.message);
        res.status(500).json({ erro: 'Erro interno do servidor ao deletar bicicleta.' });
    }
};