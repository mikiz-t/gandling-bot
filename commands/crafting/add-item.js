const { Command } = require('discord.js-commando');
const ItemRepository = require('./../../repositories/ItemRepository');
const fs = require('fs');
const path = require('path');
const { EOL } = require('os')

module.exports = class AddItem extends Command {
  constructor(client) {
    super(client, {
      name: 'add-item',
      group: 'crafting',
      memberName: 'add-item',
      description: 'Add an item to the database',
      guildOnly: true,
      args: [
        {
          key: 'item',
          prompt: 'What is the name of the item you want to add to the database?',
          type: 'string',
        },
      ]
    });
  }

  hasPermission(message) {
    return message.member.roles.cache.some(r => ['Admin', 'Mod'].includes(r.name));
  }

  async run(message, args) {
    const ItemRepo = new ItemRepository();

    try {
      await ItemRepo.save({
        item_name: args.item
      });

      fs.appendFileSync(path.join(__dirname, '../../items.csv'), args.item + EOL);

      return message.reply('Added item: ' + args.item)
    } catch (err) {
      //unique constraint violation
      if (err.code === '23505') {
        return message.reply(`"${args.item}" is already in the item database!`)
      } 
    }
  }
};
