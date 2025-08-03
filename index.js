require('dotenv').config(); 
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Collection, Client, Events, GatewayIntentBits } = require('discord.js');

const token = process.env.token;
if (!token) {
    console.error("❌ No se encontró el TOKEN en variables de entorno");
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
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

// Ejecutar tareas globales al iniciar
async function tareasGlobales() {
    const canalID = process.env.DEFAULT_CHANNEL_ID;
    if (!canalID) return;
    try {
        const canal = await client.channels.fetch(canalID);
        if (canal && canal.send) {
            await Promise.all([
                canal.send('🔧 Ejecutando Tarea A (global)...'),
                canal.send('⚙️ Ejecutando Tarea B (global)...'),
                canal.send('🚀 Ejecutando Tarea C (global)...')
            ]);
        }
    } catch (err) {
        console.error('❌ Error en tareasGlobales:', err);
    }
}

// Cuando el bot esté listo
client.once(Events.ClientReady, async readyClient => {
    console.log(`✅ BOT iniciado como ${readyClient.user.tag}`);
    await tareasGlobales();
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
            content: '⚠️ Hubo un error al ejecutar el comando.',
            ephemeral: true,
        };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(replyOptions);
        } else {
            await interaction.reply(replyOptions);
        }
    }
});

// Comando local por mensaje (ejecución manual de tareas simultáneas)
client.on('messageCreate', async message => {
    if (message.content === '!iniciar') {
        await Promise.all([
            message.channel.send('🔧 Ejecutando Tarea A (local)...'),
            message.channel.send('⚙️ Ejecutando Tarea B (local)...'),
            message.channel.send('🚀 Ejecutando Tarea C (local)...')
        ]);
    }
});

client.login(token);

// Manejo de errores generales
process.on('unhandledRejection', error => {
    console.error('🚨 Rechazo no manejado:', error);
});
process.on('uncaughtException', error => {
    console.error('🚨 Excepción no manejada:', error);
});
