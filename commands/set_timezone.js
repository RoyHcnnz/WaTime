const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('node:path');
const data = require('../fakedatabase.json');
const cityTimezones = require('city-timezones');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set_timezone')
		.setDescription('Set my timezone')
		.addStringOption(
			option => 
			option.setName('city')
			.setDescription('The city you are located')
			.setRequired(true)
		),
	async execute(interaction) {
		let cityName = interaction.options.getString('city');
		const cityRes = cityTimezones.lookupViaCity(cityName);
		if(cityRes.length<1){
			await interaction.reply(`City '${cityName}' not found`);
			return;
		}
		let timezone = cityRes[0]['timezone'];
		data[`${interaction.user.id}`]=timezone;

		// write to database
		let dbpath = path.join(__dirname, '../fakedatabase.json');
		fs.writeFile(dbpath, JSON.stringify(data), err =>{
			if(err) throw err;
	});

		await interaction.reply(`Your time zone has been set to ${timezone}`);
	},
};
