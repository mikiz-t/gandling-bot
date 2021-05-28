const { Command } = require('discord.js-commando');
const {MessageEmbed} = require("discord.js");
const ItemRepository = require('./../../repositories/ItemRepository');
const CrafterRepository = require('./../../repositories/CrafterRepository');

module.exports = class LFCraft extends Command {
  constructor(client) {
    super(client, {
      name: 'find-crafter',
      group: 'crafting',
      memberName: 'find-crafter',
      description: 'Find crafters of a given item',
      args: [
        {
          key: 'item',
          prompt: 'What is the name of the item you are looking for crafters for?',
          type: 'string',
        },
      ]
    });
  }

  async run(message, args) {
    const ItemRepo = new ItemRepository();
    const CrafterRepo = new CrafterRepository();

    const item = await ItemRepo.findOne('item_name', args.item);

    if (item.length > 0) {
      const itemName = item[0].item_name;
      const crafters = await CrafterRepo.find('item_name', itemName);
      const response = await this.createEmbedResponse(crafters, itemName, message.guild);
      return message.reply(response);
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
          const itemName = similarItems[content - 1].item_name;
          const crafters = await CrafterRepo.find('item_name', itemName);
          const response = await this.createEmbedResponse(crafters, itemName, message.guild);
          return message.reply(response);
        } else {
          return message.reply('Better luck next time');
        }
      } else {
        return message.reply('Better luck next time');
      }
    });
  }

  async createEmbedResponse(crafters, itemName, guild) {
    const embed = new MessageEmbed().setTitle(`Crafters of '${itemName}'`);

    let hordeCrafters = [];
    let allianceCrafters = [];

    for (const c of crafters) {
      let member = await guild.members.fetch(c.crafter);
      if (c.faction === 'alliance') {
        allianceCrafters.push(member.user.tag);
      } else {
        hordeCrafters.push(member.user.tag);
      }
    }

    const hordeCraftersStr = hordeCrafters.length > 0 ? hordeCrafters.join('\n') : 'None';
    const allianceCrafterStr = allianceCrafters.length > 0 ? allianceCrafters.join('\n') : 'None';

    embed.addField('Horde crafters', hordeCraftersStr);
    embed.addField('Alliance crafters', allianceCrafterStr);

    return embed;
  }
};
