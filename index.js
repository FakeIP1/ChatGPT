require('dotenv/config');
const { Client, IntentsBitField, Message } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log('on');
});

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
})
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id != process.env.CHANNEL_ID) return;
    if (message.content.startsWith('c')) return;

    let conversationLog = [{ role: 'system', content: "Bruh chat, dcuae" }];

    conversationLog.push({
        role: 'user',
        content: message.content,
    })

    await message.channel.sendTyping();

    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    })

    message.reply (result.data.choices[0].message);
});

client.login(process.env.TOKEN);
