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
	name: 'event',
	description: 'Provide a random event for the game. Additional argument would be used to limit the list to tagged events',
	async execute(message, Events, requestedTag) {
		const Discord = require('discord.js');

		function getRandomInt(max) {
			return Math.floor(Math.random() * Math.floor(max)); //return value is 0 <= value < max
		}
		
		var retrievedEvents;
		//Look through the list of events
		if(requestedTag) {
			retrievedEvents = await Events.findAll({where: {tag: requestedTag}});
		} else {
			retrievedEvents = await Events.findAll();
		}

		if(retrievedEvents.length == 0) {
			message.reply(`No events found!`);
			return;
		}

		var index = getRandomInt(retrievedEvents.length);
		var selectedEvent = retrievedEvents[index];

		const eventEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setTitle(selectedEvent.title)
			.setAuthor(message.author.username, message.author.avatarURL)
			.setDescription(selectedEvent.description)
			.setFooter(selectedEvent.tag);
		message.channel.send(eventEmbed);
	},
};