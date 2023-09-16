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
	name: 'equipment',
	description: 'See your current loadout or change what weapons/spells your character can use',
	async execute(message, characterName, slot, attack, CharacterSheets, Weapons, Spells) {
		const Discord = require('discord.js');
		var affectedCharacters;
		var slotName;

		if (!characterName) {
			//If no arguments provided:
			//DM the user the table of weapons and spells 
			console.log(`Channel Type: ${message.channel.type}`);
			if (message.channel.type != `dm`) {
				message.channel.send(`Sent you a DM of the available weapons and spells that you can equip with \`!equipment [character] [slot] [attack name]\``);
			}

			//DM user the table of weapons and spells
			const weaponList = await Weapons.findAll();
			const weaponEmbed = new Discord.RichEmbed()
				.setColor('#b32400') //Red
				.setTitle(`Weapons Table`)
				.setDescription(`List of available weapons`);

			for (var i = 0; i < weaponList.length; i++) {
				weaponEmbed.addField(`__**${weaponList[i].name}**__`, `Dmg: ${weaponList[i].diceNum}d${weaponList[i].faceNum}\nModifier: ${weaponList[i].baseAttribute}`);
			}
			message.author.send(weaponEmbed);

			const spellsList = await Spells.findAll();
			const spellsEmbed = new Discord.RichEmbed()
				.setColor('#0099ff') //Blue
				.setTitle(`Spells Table`)
				.setDescription(`List of available spells`);

			for (var i = 0; i < spellsList.length; i++) {
				spellsEmbed.addField(`__**${spellsList[i].name}**__`, `Dmg: ${spellsList[i].diceNum}d${spellsList[i].faceNum}\nMana Cost: ${spellsList[i].manaCost}`);
			}
			message.author.send(spellsEmbed);
		} else if (!slot || !attack || parseInt(slot) < 1 || parseInt(slot) > 6) {
			//If character is provided, but not the equipment, grab the character's weapons
			const character = await CharacterSheets.findOne({ where: { owner: message.author.id, name: characterName } });
			if (character) {
				const charSheetEmbed = new Discord.RichEmbed()
					.setColor('#fff9e6')
					.setTitle(character.name)
					.setAuthor(message.author.username, message.author.avatarURL)
					.setDescription(`Character's current equipment:`)
					.addField('Primary Weapon', character.primaryAttack)
					.addField('Secondary Weapon', character.secondaryAttack)
					.addField('Spell Slot 1', character.spell1)
					.addField('Spell Slot 2', character.spell2)
					.addField('Spell Slot 3', character.spell3)
					.addField('Spell Slot 4', character.spell4)
				message.channel.send(charSheetEmbed);
			} else {
				message.reply(`You don't have a character with the name ${characterName}!`);
			}
		} else if (parseInt(slot) < 3) {
			//equip the asked weapon in the primary or secondary slot
			const retrievedWeapon = await Weapons.findOne({ where: { name: attack } });
			if (!retrievedWeapon) {
				message.reply(`${attack} is not a listed Weapon!`);
				return;
			}

			if (parseInt(slot) == 1) {
				affectedCharacters = await CharacterSheets.update({ primaryAttack: retrievedWeapon.name }, { where: { owner: message.author.id, name: characterName } });
				slotName = `Primary Weapon`;
				if (affectedCharacters > 0) {
					message.reply(`${retrievedWeapon.name} equiped as ${slotName}`);
				} else {
					message.reply(`Update failed! Character not found`);
				}
			} else {
				affectedCharacters = await CharacterSheets.update({ secondaryAttack: retrievedWeapon.name }, { where: { owner: message.author.id, name: characterName } });
				slotName = `Secondary Weapon`;
				if (affectedCharacters > 0) {
					message.reply(`${retrievedWeapon.name} equiped as ${slotName}`);
				} else {
					message.reply(`Update failed! Character not found`);
				}
			}

		} else {
			const retrievedSpell = await Spells.findOne({ where: { name: attack } });
			//equip the asked spell in the correct slot
			switch (parseInt(slot)) {
				case 3:
					affectedCharacters = await CharacterSheets.update({ spell1: retrievedSpell.name }, { where: { owner: message.author.id, name: characterName } });
					slotName = `Spell Slot 1`;
					break;
				case 4:
					affectedCharacters = await CharacterSheets.update({ spell2: retrievedSpell.name }, { where: { owner: message.author.id, name: characterName } });
					slotName = `Spell Slot 2`;
					break;
				case 5:
					affectedCharacters = await CharacterSheets.update({ spell3: retrievedSpell.name }, { where: { owner: message.author.id, name: characterName } });
					slotName = `Spell Slot 3`;
					break;
				case 6:
					affectedCharacters = await CharacterSheets.update({ spell4: retrievedSpell.name }, { where: { owner: message.author.id, name: characterName } });
					slotName = `Spell Slot 4`;
					break;
				default:
					console.log(`Something went wrong. No slot cases selected in Switch statement`);
					break;
			}

			if (affectedCharacters > 0) {
				message.reply(`${retrievedSpell.name} equiped as ${slotName}`);
			} else {
				message.reply(`Update failed! Character not found`);
			}
		}
		return;
	}
}