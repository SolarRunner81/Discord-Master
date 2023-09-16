/**
 * Discord Master is a Discord bot with the purpose of acting as a 
 * tool to be used for tabletop/pen & paper games to assist playing them 
 * without or with reduced need of a dedicated Game Master or Storyteller.
 * 
 * Copyright 2020 Nathan Roberts
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
	name: 'getCharacter',
	description: 'Retrieve your character sheet',
	async execute(message, requestedName, CharterSheets) {
		const Discord = require('discord.js');

        if(!requestedName) {
			const charList = await CharterSheets.findAll({attributes: ['name']}, {where: {owner: message.author.id}});
			const charString = charList.map(c => c.name).join('\n') || 'You have no characters!';
			message.reply(`Here are your characters that you have created:\n${charString}`);
        } else {
			const character = await CharterSheets.findOne({where: {owner: message.author.id, name: requestedName}});
			if(character) {
				const charSheetEmbed = new Discord.RichEmbed()
					.setColor('#fff9e6')
					.setTitle(character.name)
					.setAuthor(message.author.username, message.author.avatarURL)
					.setDescription(`Created: ${character.createdAt}\nUpdated: ${character.updatedAt}`)
					.addField('Class', character.class, true)
					.addField('Level', character.level, true)
					.addField('Race', character.race, true)
					.addField('Alignment', character.alignment, true)
					.addField('Primary', character.primaryAttack)
					.addField('Secondary', character.secondaryAttack)
					.addField('Spell Slot 1', character.spell1, true)
					.addField('Spell Slot 2', character.spell2, true)
					.addField('Spell Slot 3', character.spell3, true)
					.addField('Spell Slot 4', character.spell4, true)
					.addBlankField()
					.addField('Strength', character.strength)
					.addField('Dexterity', character.dexterity)
					.addField('Constitution', character.constitution)
					.addField('Intelligence', character.intelligence)
					.addField('Wisdon', character.wisdom)
					.addField('Charisma', character.charisma);
				message.channel.send(charSheetEmbed);
			}
		}
	},
};