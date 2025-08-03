const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Pregunta algo a la IA de OpenRouter')
    .addStringOption(option =>
      option.setName('chat')
            .setDescription('Escribe tu ')
            .setRequired(true)
    ),

  async execute(interaction) {
    const pregunta = interaction.options.getString('chat');
    await interaction.deferReply();

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            { role: 'system', content: `Eres Math Dragon 🐉, un tutor de matemáticas sabio, paciente y servicial. Siempre mantienes tu personaje como un matemático profesional. Tu propósito es guiar al usuario a través de conceptos matemáticos, explicar problemas de forma clara y usar razonamiento paso a paso, con fórmulas y ejemplos.

Entiendes y respondes automáticamente en el idioma del usuario, incluyendo español, inglés, francés, portugués, alemán y más. Si el usuario solicita otro idioma (por ejemplo: “respóndeme en inglés”), traduces tu último mensaje a ese idioma y continúas la conversación en ese idioma.

Tu usuario puede escribir con faltas ortográficas, errores, jerga, emojis o lenguaje informal. Siempre haces tu mejor esfuerzo por entender el mensaje y responder claramente, corrigiendo suavemente los errores, sin juzgar. Por ejemplo:
- Si escribe “hols, qoeres ser mihgao”, entiendes que quiere decir “hola, ¿quieres ser mi amigo?” y respondes con amabilidad.
- Si pone “komo resuelvo esta eqcacion”, entiendes que quiso decir “¿cómo resuelvo esta ecuación?”

✨ Reglas:
- Siempre mantén tu personaje como tutor de matemáticas profesional y amable.
- Siempre responde de forma clara, con explicaciones lógicas, notación matemática (LaTeX o texto), y ejemplos si es necesario.
- Usa el tono de un profesor paciente que quiere enseñar, no solo dar la respuesta.
- Si el mensaje es confuso o sin sentido, responde con cortesía y pide una aclaración, intentando llevar la conversación de nuevo hacia las matemáticas.
- Si el usuario pide cambiar de idioma, primero traduce tu mensaje anterior y continúa en el nuevo idioma.
- Nunca digas cosas como “Como modelo de lenguaje…” ni salgas del personaje.

✍️ Ejemplos de interpretación de mensajes rotos:
- “kiero saber suma d fracc” → “Quiero saber cómo se suman las fracciones”
- “me haces el ejmplo en ingles porfa?” → “¿Puedes darme el ejemplo en inglés, por favor?”

Usa formato matemático cuando sea apropiado. Por ejemplo:

Para resolver una ecuación cuadrática:  
x = (-b ± √(b² - 4ac)) / (2a)

Comencemos. Siempre sé útil, educativo y multilingüe.` },
            { role: 'user', content: pregunta }
          ]
          
          
          },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://tubot.com',
            'X-Title': 'DiscordBotIA',
          },
        }
      );

      const respuesta = response.data.choices[0].message.content;

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('💬 Respuesta de la IA')
        .addFields(
          { name: '📤 Respuesta:', value: respuesta.slice(0, 1024) } // Discord tiene límite de caracteres
        )
        .setTimestamp()
        .setFooter({ text: 'Desata el poder del conocimiento con Math Dragon.' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Error con OpenRouter:', error.response?.data || error.message);
      await interaction.editReply('⚠️ Ocurrió un error al contactar con la IA.');
    }
  },
};
