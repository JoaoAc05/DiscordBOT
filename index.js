import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
});

import { config } from "dotenv";
config();
import fs from 'fs';
const comandosJson = JSON.parse(fs.readFileSync('./Comandos.json', 'utf8'));
import app from "./src/app.js";

const port = normalizaPort(process.env.PORT || '3000');

function normalizaPort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }
    return false;
}

client.once("ready", () => {
    console.log(`RuralHub Bot foi iniciado em ${client.guilds.cache.size} servidores.`); // Exibir informações de servidores
    client.user.setActivity(`Conheça a https://ruralhub.com.br/`);
})
client.login(process.env.TOKEN);

// Configurar os comandos do bot
client.commands = new Map(); //Criando uma nova colenção que ira armazenar os comandos finais

comandosJson.forEach(comando => { //forEach vai navegar por dentro de cada objeto do array do json
    const { data, execute, execute2, execute3, execute4 } = comando; //Desestruturar o objeto

    if (data && data.name && data.description && execute) { //Garantir que o comando tenha os parâmetros necessarios

        const commandObject = { data }; //Criando um objeto com a propriedade data
        commandObject.execute = async (interaction) => { //Adicionando o execute e demais no objeto junto a suas estruturas de interação

            await interaction.reply(execute); //Extrutura de interação para o execute

            if (execute2) { //Se tiver o execute2 - interagir com followUp
                await interaction.followUp(execute2);
            }
            if (execute3) {
                await interaction.followUp(execute3);
            }
            if (execute4) {
                await interaction.followUp(execute4);
            }
        };

        client.commands.set(data.name, commandObject); //Adicionar os comandos a collection
    } else {
        console.log(`Comando inválido: ${JSON.stringify(comando)}`); //Converte o objeto em string para exibir algum comando que não tenha os parâmetros data e execute
    }
});

// Listener para interações
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return; //Se não for uma interação de chat de comando ignore

    const command = client.commands.get(interaction.commandName); //command assume os comandos da lista do collection
    if (!command) {
        interaction.reply({
            content: `Comando não encontrado: ${interaction.commandName}`,
            ephemeral: true
        })
        return;
    }

    try {
        // Executar o comando
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: `Ocorreu um erro ao executar o comando.\nErro: ${error}`,
            ephemeral: true
        });
    }
});

//Requerimento do evento de entrada e saida de membros do servidor.
import "./Eventos/EntradaSaida_Membros.js";

client.on("messageCreate", async message => {
    const args = message.content.trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if(comando === "avatar") { //Enviar a imagem do avatar
        message.channel.send(`https://cdn.discordapp.com/avatars/565974725797609514/${message.author.avatar}.webp?size=256`);
    }

    if(comando === "ping") {
        try {
            const m = await message.channel.send("Pong!");
            m.edit(`Latencia do bot é: ${m.createdTimestamp - message.createdTimestamp}ms`);
        } catch (error) {
            await message.channel.send({
                content: `Ocorreu um erro ao verificar atividade do BOT.\nErro: ${error}`,
                ephemeral: true
            })
        }
    }   
});

app.listen(port, function () {
    console.log(`Servidor REST API rodando na porta ${port}.`);
});

// Pra executar só usar o comando: node server.js ou node --no-warnings index.js
// os warnings se referen ao assertation na importação do json com os comandos. A extrutura dele pode ser inutilizada ou alterada nas próximas versoes do node