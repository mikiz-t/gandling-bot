const { Command } = require('discord.js-commando');
const {MessageEmbed} = require("discord.js");
const ItemRepository = require('./../../repositories/ItemRepository');
const CrafterRepository = require('./../../repositories/CrafterRepository');

module.exports = class RemoveCraft extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-craft',
      group: 'crafting',
      memberName: 'remove-craft',
      description: 'Remove yourself as a crafter of an item',
      examples: ['!remove-craft "Spellstrike Hood" alliance'],
      throttling: {
        usages: 1,
        duration: 3
      },
      args: [
        {
          key: 'item',
          prompt: 'What is the name of the item you want to be removed as a crafter of?',
          type: 'string',
        },
        {
          key: 'faction',
          prompt: 'Horde or Alliance?',
          type: 'string',
          oneOf: ['horde', 'alliance'],
        }
      ]
    });
  }

  async run(message, args) {
    const ItemRepo = new ItemRepository();
    const CrafterRepo = new CrafterRepository();

    const item = await ItemRepo.findOne('item_name', args.item);

    if (item.length === 1) {
      await CrafterRepo.delete({
        crafter: message.author.id,
        item_name: item[0].item_name,
        faction: args.faction.toLowerCase()
      });

      return message.reply('You have been removed as a crafter of: ' + item[0].item_name);
    }

    const similarItems = await ItemRepo.findSimilar('item_name', args.item);

    const embed = new MessageEmbed()
      .setTitle(`I don't recognise that item. Did you mean one of these?`)
      .setDescription('If yes, reply with the number');

    let itemsStr = '';

    similarItems.forEach((item, i) => {
      itemsStr += `**${i + 1}.** ${item.item_name} \n`;
    });

    embed.addField('Items', itemsStr);

    await message.reply(embed);

    const collector = message.channel.createMessageCollector((m) => {
      return m.author.id === message.author.id;
    }, {
      time: 20000,
      max: 1
    });

    collector.on('end', async (collected) => {
      if (collected.first()) {
        const content = Number(collected.first().content);

        if (content > 0 && content <= similarItems.length) {
          await CrafterRepo.delete({
            crafter: message.author.id,
            item_name: similarItems[content - 1].item_name,
            faction: args.faction.toLowerCase()
          });
          return message.reply('You have been removed as a crafter of: ' + similarItems[content - 1].item_name);
        } else {
          return message.reply('Better luck next time');
        }
      } else {
        return message.reply('Better luck next time');
      }
    });
  }
};
