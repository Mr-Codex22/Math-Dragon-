const {SlashCommandBuilder} = require('discord.js')
const { execute } = require('./ping')

module.exports = {
data: new SlashCommandBuilder() 
    .setName('user')
    .setDescription('informacion sobre el usuario'),
    
    async execute(interaction) {
        await interaction.reply(`Este comando estuvo coriendo por ${interaction.user.username}, quien se unio en ${interaction.member.joinedAt} `)
    }
}

