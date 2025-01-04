import fs from 'fs';
import path from 'path';

const comandosPath = path.join(process.cwd(), "Comandos.json");
console.log(`Acessando arquivo: ${comandosPath}`);

class ComandosController {
    // Carregar comandos uma única vez para otimizar
    loadComandos() {
        try {
            if (fs.existsSync(comandosPath)) {
                return JSON.parse(fs.readFileSync(comandosPath, 'utf-8'));
            } else {
                // Cria o arquivo vazio caso não exista
                fs.writeFileSync(comandosPath, JSON.stringify([]));
                return [];
            }
        } catch (error) {
            console.error("Erro ao ler o arquivo Comandos.json:", error);
            return [];
        }
    }

    // getAll = (req, res) => {
    //     const comandos = this.loadComandos();
    //     res.json(comandos);
    // }

    getAll = (req, res) => {
        console.log("CAIU NA ROTA GETALL")
        try {
            const comandos = this.loadComandos();
    
            // Obtém os parâmetros de query: página e limite
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 10;
    
            // Valida os parâmetros
            if (page < 1 || limit < 1) {
                return res.status(400).json({ message: "Page e limit devem ser maiores que 0." });
            }
    
            // Calcula o índice inicial e final
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
    
            // Verifica se a página contém resultados
            if (startIndex >= comandos.length) {
                return res.status(404).json({ message: "Nenhum comando encontrado para esta página." });
            }
    
            // Cria o objeto de resposta
            const response = {
                currentPage: page,
                totalPages: Math.ceil(comandos.length / limit),
                totalComandos: comandos.length,
                comandos: comandos.slice(startIndex, endIndex)
            };
    
            res.json(response);
        } catch (error) {
            console.error("Erro ao obter comandos:", error);
            res.status(500).json({ message: "Erro ao buscar os comandos." });
        }
    };

    getName = (req, res) => {
        const name = req.query.name;
        console.log("CAIU NA ROTA GET NAME")
    
        if (!name) {
            return res.status(400).json({ message: "O parâmetro 'name' é obrigatório." });
        }
    
        try {
            const comandos = this.loadComandos();
            
            // Filtra os comandos onde o nome contém o valor passado no parâmetro 'name'
            let comandosFiltrados = comandos.filter(comando => 
                comando.data.name.toLowerCase().includes(name.toLowerCase()) // Ignora maiúsculas/minúsculas
            );
    
            if (comandosFiltrados.length === 0) {

                comandosFiltrados = comandos.filter(comando => 
                    comando.data.description.toLowerCase().includes(name.toLowerCase()) // Ignora maiúsculas/minúsculas
                );
                
                if (comandosFiltrados.length === 0) {
                    return res.status(404).json({ message: "Nenhum comando encontrado com esse nome." });
                }
            }
    
            // Se houver comandos encontrados, retorna os dados
            res.json({
                totalComandos: comandosFiltrados.length,
                comandos: comandosFiltrados
            });
        } catch (error) {
            console.error("Erro ao buscar comandos por nome:", error);
            res.status(500).json({ message: "Erro ao buscar comandos." });
        }
    };
    

    addComandos = (req, res) => {
        console.log("CAIU NA ROTA ADD COMANDO")
        const { data, execute, execute2, execute3 } = req.body;
        const { page = 1, limit = 10 } = req.query;

        // Converta para números
        const currentPage = Number(page);
        const limitPerPage = Number(limit);
    
        // Verificar campos obrigatórios
        if (!data || !data.name || !data.description || !execute) {
            return res.status(400).json({
                error: "Campos obrigatórios: data (name, description), execute."
            });
        }
    
        const comandos = this.loadComandos();
    
        // Criar o novo comando
        const novoComando = {
            id: comandos.length ? comandos[comandos.length - 1].id + 1 : 1, // Gerar um ID único
            data,
            execute
        };
    
        if (execute2 && execute2.trim() !== "") {
            novoComando.execute2 = execute2;
        }
        if (execute3 && execute3.trim() !== "") {
            novoComando.execute3 = execute3;
        }
    
        // Adicionar novo comando na lista e salvar no arquivo
        comandos.push(novoComando);
        fs.writeFileSync(comandosPath, JSON.stringify(comandos, null, 2));
    
        res.status(201).json(novoComando);
        console.log(`Novo comando adicionado: ${JSON.stringify(novoComando.data.name)} - ${JSON.stringify(novoComando.data.description)}`)
    };

    alterComandos = (req, res) => {
        console.log("CAIU NA ROTA ALTER COMANDO")
        const id = parseInt(req.params.id);
        const { data, execute, execute2, execute3 } = req.body;
        let novosDados = { data, execute }; // Inicializa com os dados obrigatórios.
    
        const comandos = this.loadComandos();
        const comandoIndex = comandos.findIndex(comando => comando.id === id);
    
        if (comandoIndex === -1) {
            return res.status(404).json({ error: "Comando não encontrado." });
        }
    
        // Verificando e adicionando execute2 somente se não for vazio
        if (typeof execute2 === 'string' && execute2.trim() !== '') {
            novosDados.execute2 = execute2.trim();
        } else if (execute2 === undefined || execute2 === null || execute2.trim() === '') {
            delete comandos[comandoIndex].execute2;
        }
    
        // Verificando e adicionando execute3 somente se não for vazio
        if (typeof execute3 === 'string' && execute3.trim() !== '') {
            novosDados.execute3 = execute3.trim();
        } else if (execute3 === undefined || execute3 === null || execute3.trim() === '') {
            delete comandos[comandoIndex].execute3;
        }
        
    
        // Atualizando o comando com os novos dados
        comandos[comandoIndex] = { ...comandos[comandoIndex], ...novosDados };
    
        // Salvando no arquivo
        fs.writeFileSync(comandosPath, JSON.stringify(comandos, null, 2));
        res.json(comandos[comandoIndex]);
        console.log(`Comando ${data.name} foi alterado.`)
        // Um detalhe muito importante neste código: Devido ao comandos[comandoIndex] possuir apenas os dados que foram alterados,
        // nos casos de não haver nenhuma alteração no execute2 ou 3, eles não serão nem excluidos nem alterados.
    };
    

    deleteComandos = (req, res) => {
        console.log("CAIU NA ROTA DELETE COMANDO")
        const id = parseInt(req.params.id);

        const comandos = this.loadComandos();
        const comandoIndex = comandos.findIndex(comando => comando.id === id);

        if (comandoIndex === -1) {
            return res.status(404).json({ error: "Comando não encontrado." });
        }

        const comandoRemovido = comandos.splice(comandoIndex, 1);
        fs.writeFileSync(comandosPath, JSON.stringify(comandos, null, 2));
        res.json(comandoRemovido);
        console.log(`Comando com o ID ${id} foi deletado.`)
    }
}

export default ComandosController;
