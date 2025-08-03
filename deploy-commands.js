require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // Si quieres global, deja esto vacío o comenta esta línea
const token = process.env.TOKEN;

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[⚠️] El comando ${filePath} no tiene "data" o "execute".`);
		}
	}
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`🔄 Registrando ${commands.length} comandos...`);

		let data;
		if (guildId) {
			// Comandos locales (por servidor)
			data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands }
			);
			console.log(`✅ ${data.length} comandos registrados en el servidor.`);
		} else {
			// Comandos globales
			data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands }
			);
			console.log(`✅ ${data.length} comandos registrados globalmente.`);
			console.log('⏳ Recuerda: los comandos globales pueden tardar hasta 1 hora en aparecer.');
		}
	} catch (error) {
		console.error('❌ Error al registrar comandos:', error);
	}
})();
