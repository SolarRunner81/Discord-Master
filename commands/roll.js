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
	name: 'roll',
	description: 'Roll any conceivable dice in the world... digitally... and indirectly since the bot is actually doing it...',
	async execute(message, diceNum, faceVal, modifier, reason) {
        function getRandomInt(max) {
			return Math.floor(Math.random() * Math.floor(max)) + 1; //Math.floor(Math.random() * (max - min + 1)) + min //where min is 1
		}

		var output = `${reason}: \``;

		var total = 0;
		var i;
		for(i = 0; i < diceNum; i++) {
			rollValue = getRandomInt(faceVal);
			total += rollValue;
			if(i+1 < diceNum) {
				output += `${rollValue} + `;
			} else {
				output += `${rollValue}\`\n`;
			}
		}

		output += `= ${total}`;
		if(modifier > 0) {
			total += parseInt(modifier);
			output += ` + ${modifier}\n= ${total}`
		}

		message.channel.send(output);
		
	},
};