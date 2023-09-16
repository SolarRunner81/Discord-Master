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
    name: 'enemies',
    description: 'Retrieve the list of possible enemies',
    async execute(message, Enemies) {
        const Discord = require('discord.js');
        
        //DM the user the table of enemy types
        console.log(`Channel Type: ${message.channel.type}`);
        if (message.channel.type != `dm`) {
            message.channel.send(`Sent you a DM of the available enemies that you can encounter with \`!encounter [enemyName](#[quantity])\``);
        }

        //DM user the table of weapons and spells
        const enemiesList = await Enemies.findAll();
        const enemiesEmbed = new Discord.RichEmbed()
            .setColor('#9900cc') //Purple
            .setTitle(`Enemy Table`)
            .setDescription(`List of Enemies`);

        for (var i = 0; i < enemiesList.length; i++) {
            enemiesEmbed.addField(`__**${enemiesList[i].name}**__`,
                `Base Damage: ${enemiesList[i].baseDamage}
                Attack: ${enemiesList[i].attackDescription}
                STR: ${enemiesList[i].strength}
                DEX: ${enemiesList[i].dexterity}
                CON: ${enemiesList[i].constitution}
                INT: ${enemiesList[i].intelligence}
                CHA: ${enemiesList[i].charisma}`);
        }
        message.author.send(enemiesEmbed);

    },
};