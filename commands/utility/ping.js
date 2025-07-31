const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("si tu no sabes que es Ping eres un real mamañema"),

    async execute(interaction) {
        await interaction.reply('Pong')
    }
}