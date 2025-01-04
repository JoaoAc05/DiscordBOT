import { exec } from "child_process";
import { Console } from "console";

class AdministratorController {
    updateComandos(req, res){
        console.log("ROTA SINCRONIZAR COMANDOS")
        exec("node UpdateComandos.js", (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar o script: ${error.message}`);
                return res.status(500).json({ error: "Erro ao sincronizar comandos." });
            }
            if (stderr) {
                console.error(`Erro no script: ${stderr}`);
                return res.status(500).json({ error: "Erro no script de sincronização." });
            }
    
            console.log(`Resultado: ${stdout}`);
            return res.status(200).json({ message: "Sincronização concluída com sucesso!" });
        });
    };

    
}

export default AdministratorController;
