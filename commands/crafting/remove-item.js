const { Command } = require('discord.js-commando');
const ItemRepository = require('../../repositories/ItemRepository');
const fs = require('fs');
const path = require('path');
const { EOL } = require('os')

module.exports = class RemoveItem extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-item',
      group: 'crafting',
      memberName: 'remove-item',
      description: 'Remove an item to the database',
      guildOnly: true,
      examples: ['!remove-item "Spellstrike Hood"'],
      throttling: {
        usages: 1,
        duration: 3
      },
      args: [
        {
          key: 'item',
          prompt: 'What is the name of the item you want to remove from the database?',
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
      await ItemRepo.delete({
        item_name: args.item
      });

      const fileContents = fs.readFileSync(path.join(__dirname, '../../items.csv'), 'utf8');

      const items = fileContents
                      .split(EOL)
                      .filter(i => i.toLowerCase() !== args.item.toLowerCase())
                      .join(EOL);

      fs.writeFileSync(path.join(__dirname, '../../items.csv'), items);

      return message.reply('Removed item: ' + args.item)
    } catch (err) {
      console.log(err);
    }
  }
};
