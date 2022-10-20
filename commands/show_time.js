const { SlashCommandBuilder, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

let cmd = new SlashCommandBuilder()
		.setName('show_time')
		.setDescription("Show local time of a user or a city")
;

let subcmdCollection = new Collection();
const subcommandsPath = path.resolve('commands/show_time/');
const subcommandFiles = fs.readdirSync(subcommandsPath).filter(file => file.endsWith('.js'));

for (const subcmdfile of subcommandFiles) {
	const filePath = path.join(subcommandsPath, subcmdfile);
	const subcommand = require(filePath);

	subcmdCollection.set(subcommand.subcmd.name, subcommand);
	slashCmd.addSubcommand(subcommand.subcmd);
}

module.exports = {
	data: cmd,
	async execute(interaction) {
		let subcmdName = interaction.options.getSubcommand();
		let subcmd = subcmdCollection.get(subcmdName);
		await subcmd.execute(interaction);
	},
};
