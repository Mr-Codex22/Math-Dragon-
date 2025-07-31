const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Obtener desde variables de entorno
const clientId = process.env.CLIENT_ID;
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
			console.log(`[WARNING] El comando ${filePath} no tiene "data" o "execute".`);
		}
	}
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`🔄 Registrando ${commands.length} comandos globales (/)...`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`✅ Se registraron ${data.length} comandos globales.`);
		console.log('⏳ Puede tardar hasta 1 hora en aparecer en Discord.');
	} catch (error) {
		console.error('❌ Error al registrar comandos:', error);
	}
})();
