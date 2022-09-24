const { SlashCommandBuilder} = require('discord.js');
const data = require('../fakedatabase.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show_time')
		.setDescription("Show user's local time based on its timezone")
		.addUserOption(option =>
			option.setName("target")
				.setDescription('The user you want to check time')
				.setRequired(true)
		),
	async execute(interaction) {
		let targetUser = interaction.options.getUser('target');
		let timezone = data[targetUser.id];
		if(!timezone){
			await interaction.reply(`${targetUser.tag} has not set a local timezone`);
			return;
		}
		/*
		let date = new Date()
			.toLocaleString("en-US", {
					timeZone: timezone,
					weekday: "short",
					year: "numeric",
					month: "numeric",
					day: "numeric",
					hour: "numeric",
					hour12: false,
					minute: "numeric",
					timeZoneName: "long"
		});
*/
		let date = new Date().toLocaleString("zh-TW",{
			timeZone: timezone,
			day: "2-digit",
			timeZoneName: "long"
		});
		let tzlong = date.substring(4);
		date = new Date()
			.toLocaleString("en-US", {
					timeZone: timezone,
					dateStyle: "short",
					timeStyle: "short"
        });

		await interaction.reply(`${targetUser.tag}: ${timezone}, ${tzlong} \n${date}`);
	},
};
