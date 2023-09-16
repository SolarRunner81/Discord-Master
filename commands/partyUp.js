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
	name: 'partyUp',
	description: 'Decide your party to quest with!',
	async execute(message, character, CharacterSheets, Party) {
		if(!character) {
			message.channel.send(`Let's start an adventure! Join the party by typing \`!partyUp [existing character name]\``);
			return;
		}
		
		const member = await CharacterSheets.findOne({ where: {name: character, owner: message.author.id}});
		if(member) {
			//If a character sheet is found, add the character to the party
			const partyMember = await Party.create({
				userId: member.owner,
				character: member.name
			});
			return message.reply(`**${partyMember.character}** Has joined the party!`);
		} else {
			message.channel.send(`No character found! Make sure the character name is correct or is owned by you. Check the characters that you own with \`!getCharacter\``);
		}
    }
}