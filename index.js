const Discord = require('discord.js-selfbot-v13');
const fetch = require('node-fetch');
const chalk = require('chalk');
require('dotenv').config();

console.clear();
console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), (chalk.green(`Starting Up`)))
console.log(`\u001b[0m`)
console.log(chalk.blue(chalk.bold(`©4btin User Chat SelfBot`)), (chalk.white(`|`)), (chalk.green(`2005 - ${new Date().getFullYear()}`)), (chalk.white(`|`)), (chalk.red(`All Rights Reserved`)))
console.log(`\u001b[0m`)

const client = new Discord.Client ({
    checkUpdate: false,
});

client.once('ready', () => {
    console.log(chalk.blue(chalk.bold(`${client.user.tag}`)), (chalk.green(`Ready`)))
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(process.env.Prefix)) return;

    const args = message.content.slice(process.env.Prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'gpt') {
        const inputText = args.join(' ');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.OpenAI,
                },
                body: JSON.stringify({
                    'model': 'gpt-3.5-turbo',
                    'messages': [{
                        'role': 'user',
                        'content': inputText
                    }]
                })
            });

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                const replyText = data.choices[0].message.content.trim();
                message.channel.send(replyText);
            } else {
                console.error('GPT-3 API response is not in expected format:', data);
                message.channel.send('An error has occurred, please try again later.');
            }
        } catch (error) {
            console.error('GPT-3 API error:', error);
            message.channel.send('An error has occurred, please try again later.');
        }
    }
});

client.login(process.env.UserToken);