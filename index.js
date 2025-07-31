const fs = require('fs');
const path = require('path');
const express = require('express');
const { Collection, Client, Events, GatewayIntentBits } = require('discord.js');

// ⚠️ Soporte para token en mayúscula o minúscula
const token = process.env.TOKEN || process.env.token;
if (!token) {
    console.error("❌ No se encontró el TOKEN en variables de entorno");
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Express para mantener activo en Render
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('💪 Bot Math Dragon activo y funcionando');
});
app.listen(PORT, () => {
    console.log(`🌐 Servidor Express activo en puerto ${PORT}`);
});

// Cargar comandos
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] El comando ${filePath} no tiene "data" o "execute".`);
        }
    }
}

// Cuando el bot esté listo
client.once(Events.ClientReady, readyClient => {
    console.log(`BOT started how ${readyClient.user.tag}`);
});

// Manejo de interacciones
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No se encontró el comando ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const replyOptions = {
            content: 'Hubo un error al ejecutar el comando.',
            ephemeral: true,
        };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(replyOptions);
        } else {
            await interaction.reply(replyOptions);
        }
    }
});

// Iniciar sesión en Discord
client.login(token);

// Manejo de errores generales
process.on('unhandledRejection', error => {
    console.error('🚨 Rechazo no manejado:', error);
});
process.on('uncaughtException', error => {
    console.error('🚨 Excepción no manejada:', error);
});
