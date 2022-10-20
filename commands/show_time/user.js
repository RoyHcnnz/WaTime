const { SlashCommandSubcommandBuilder } = require("discord.js");
const path = require('node:path');
const data = require(path.resolve('fakedatabase.json'));

let subcmd = new SlashCommandSubcommandBuilder()
	.setName('user')
	.setDescription("Show user's local time based on its timezone")
	.addUserOption(option =>
		option.setName("target")
			.setDescription('The user you want to check time')
			.setRequired(true)
);

module.exports = {
	data: subcmd,
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
			.toLocaleString("zh-TW", {
					timeZone: timezone,
					hour12: false,
					dateStyle: "short",
					timeStyle: "short"
        });
		
		const weekday = date.toLocaleDateString("zh-TW", { weekday: 'short' });

		await interaction.reply(`${targetUser.tag}: ${timezone}, ${tzlong} \n${date} ${weekday}`);
	}
}