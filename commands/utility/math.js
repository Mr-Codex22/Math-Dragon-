const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("math")
    .setDescription("this command perfoms mathematical operation such as multiply, add, subtract, dioovide")
    .addNumberOption(option =>
        option.setName('num1')
        .setDescription('first number')
        .setRequired(true))
        .addStringOption(option => 
            option.setName('operator')
            .setDescription("x, +, -, / ")
            .setRequired(true)
            .addChoices(
                {name: "add(+)",     value: "+"},
                {name: "divide(/)",  value: "/"},
                {name: "multiply(*)", value: "*"},
                {name: "subtract(-)", value: "-"}
            )
        )
        .addNumberOption(option =>
            option.setName('num2')
            .setDescription('second number')
            .setRequired(true)),

            async execute(interaction) {
                const num1 = interaction.options.getNumber("num1")
                const num2 = interaction.options.getNumber("num2")
                const operator =  interaction.options.getString("operator")

                let result

                switch (operator) {
                    case '+':
                      result = num1 + num2;
                      break;
                    case '-':
                      result= num1 - num2;
                      break;
                    case '*':
                      result = num1 * num2;
                      break;
                    case '/':
                        if (num2 === 0) {
                            return await interaction.reply("Cannot divide by 0")
                        }
                        result = num1 / num2;
                        break;
                        default:  return await interaction.reply("❌ Operador inválido.")
            }
            await interaction.reply(`✅ Resultado: **${num1} ${operator} ${num2} = ${result}**`);
        }
    }