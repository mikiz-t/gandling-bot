require('dotenv').config();
const Commando = require('discord.js-commando');
const path = require('path');
const db = require('./database');

const client = new Commando.Client({
	commandPrefix: '!',
	owner: process.env.OWNER
});

client.registry
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands({
    eval: false,
		unknownCommand: false
  })
	.registerGroups([
		['crafting'],
	])
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', async() => {
	try {
		const file = path.join(__dirname, 'items.csv')
		await db.raw(`
			CREATE TEMP TABLE tmp_items
			AS
			SELECT item_name FROM items WITH NO DATA;
		
			COPY tmp_items(item_name) FROM '${file}' DELIMITER ',' CSV HEADER;
			
			DELETE FROM items;
		
			INSERT INTO items (item_name)
			SELECT item_name FROM tmp_items 
			ON CONFLICT DO NOTHING;
		`);
	} catch (e) {
		console.log(e);
	}
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
});

client.on('error', console.error);

client.login(process.env.TOKEN);
