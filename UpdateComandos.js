import { config } from 'dotenv';
config();
import comandosJson from './Comandos.json' assert { type: 'json' };
import { REST, Routes } from 'discord.js';

// Instância REST
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Resetando ${comandosJson.length} comandos.`);

        // Mapear os comandos JSON para o formato esperado pelo Discord. Pois se não ele vai reconhecer como objeto
        const commands = comandosJson.map(comando => ({
            name: comando.data.name,
            description: comando.data.description,
        }));

        // Enviar os comandos para o Discord
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("Comandos registrados!");
    } catch (error) {
        console.error(`Erro ao fazer a sincronização dos comandos: ${error}`);
    }
})();