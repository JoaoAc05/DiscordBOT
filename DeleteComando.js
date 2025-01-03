import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
config();

const rest = new REST().setToken(process.env.TOKEN);

const command_id = '' //DIGITE AQUI O ID DO COMANDOS


// Comando teste na guild minha = 1320026679963422731

// for guild-based commands                                      \\ID Servidor          \\ID Comando
rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, command_id))
	.then(() => console.log('Comando Deletado do Servidor Com Sucesso!'))
	.catch(console.error);

// for global commands               \\ID do BOT              \\ID Comando
rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, command_id))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);