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
	name: 'party',
	description: 'Display the current party',
	async execute(message, Party, client, Discord) {
		const partyList = await Party.findAll();
		if (partyList.length < 1) {
			message.channel.send(`There are no party members!`);
			return;
		}

		var output = ``;
		for (const member of partyList) {
			var user = client.users.get(member.userId);
			output += `Character: ${member.character}   |   User: ${user.username} \n`
		}

		const partyEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setTitle(`Party Members`)
			.setDescription(output)

		message.channel.send(partyEmbed);
	}
}