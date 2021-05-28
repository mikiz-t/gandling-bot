const { Command } = require('discord.js-commando');
const {MessageEmbed} = require("discord.js");
const CrafterRepository = require('./../../repositories/CrafterRepository');

module.exports = class AddCraft extends Command {
  constructor(client) {
    super(client, {
      name: 'list-crafts',
      group: 'crafting',
      memberName: 'list-crafts',
      description: 'List all items that a specific person can craft',
      examples: ['!list-crafts @Mikiz'],
      throttling: {
        usages: 1,
        duration: 3
      },
      args: [
        {
          key: 'crafter',
          prompt: 'Who\'s crafts are you looking for?',
          type: 'member',
        },
      ]
    });
  }

  async run(message, args) {
    const CrafterRepo = new CrafterRepository();

    const crafts = await CrafterRepo.find('crafter', args.crafter.user.id);

    const embed = new MessageEmbed().setTitle(`${args.crafter.nickname} can craft:`);

    let hordeCrafts = [];
    let allianceCrafts = [];

    for (const c of crafts) {
      if (c.faction === 'alliance') {
        allianceCrafts.push(c.item_name);
      } else {
        hordeCrafts.push(c.item_name);
      }
    }

    const hordeCraftsStr = hordeCrafts.length > 0 ? hordeCrafts.join('\n') : 'None';
    const allianceCraftsStr = allianceCrafts.length > 0 ? allianceCrafts.join('\n') : 'None';

    embed.addField('On Horde', hordeCraftsStr);
    embed.addField('On Alliance', allianceCraftsStr);

    message.reply(embed);
  }
};
