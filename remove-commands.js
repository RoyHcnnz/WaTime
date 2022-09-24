const { REST, Routes } = require('discord.js');
const { clientId,  watimeTOKEN } = require('./config.json');

const rest = new REST({ version: '10'}).setToken(watimeTOKEN);

rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then (() => console.log('Successfully deleted application command'))
	.catch(console.error);
