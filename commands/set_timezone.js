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
		// only get ten results to prevent too many choices for the user
		const cityRes = cityTimezones.lookupViaCity(cityName).slice(0,10);
		// if no city found
		if(cityRes.length<1){
			await interaction.reply(`City '${cityName}' not found`);
			return;
		}
		let timezone;
		// if more than one result found
		if(cityRes.length>1){
			let cityOptions = "";
			cityRes.forEach((element, index) => {
				cityOptions += (index+1) + ": " + element["country"] + "\n";
			});
			await interaction.reply(cityOptions);
			// set up for user's respond;
			//const filter = m => interaction.user.id === m.author.id;
			const filter = m => true;

			await interaction.channel.awaitMessages({filter, time: 10000, max:1})
				.then(messages => {
					timezone = cityRes[parseInt(messages.first().content)-1]['timezone'];
				})
				.catch(() => {
					interaction.followUp("No reply received, your time zone has not been set");
				});
		}else{
			// if exactly one result found
			timezone = cityRes[0]['timezone'];
			await interaction.reply(timezone + " has been found.");
		}
		if(!timezone) {
				return;
		}
		data[`${interaction.user.id}`]=timezone;

		// write to database
		let dbpath = path.join(__dirname, '../fakedatabase.json');
		fs.writeFile(dbpath, JSON.stringify(data), err =>{
			if(err) throw err;
	});

		await interaction.followUp(`Your time zone has been set to ${timezone}`);
	},
};
