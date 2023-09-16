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
    name: 'encounter',
    description: 'Who approaches? Foes that wish to fight',
    async execute(message, args, Enemies, Foes) {
        const Discord = require('discord.js');

        function calculateHealth(base, constitution) {
            const variance = Math.floor(Math.random() * (Math.floor(constitution) + 1)); //Math.floor(Math.random() * (max - min + 1)) + min //where min is 0
            return base + variance;
        }

        if (args.length > 0) {
            //Add provided enemies to the Foes table
            for (var i = 0; i < args.length; i++) {
                var enemyInput = args[i];
                if (enemyInput.includes(`#`)) {
                    //If splitter included, add the number of requested enemy type
                    console.log(`Splitting character found`);
                    split = enemyInput.split(`#`);
                    var enemyName = split[0];
                    var num = split[1];
                    const foundEnemy = await Enemies.findOne({ where: { name: enemyName } });
                    if (foundEnemy && parseInt(num) > 0) {
                        for (var j = 1; j <= num; j++) {
                            const calcHp = calculateHealth(foundEnemy.baseDamage, foundEnemy.constitution);
                            const verify = await Foes.create({
                                name: `${enemyName}_${j}`,
                                currentHP: calcHp,
                                maxHP: calcHp,
                                enemyType: enemyName,
                                baseDamage: foundEnemy.baseDamage,
                                attackDescription: foundEnemy.attackDescription,
                                strength: foundEnemy.strength,
                                dexterity: foundEnemy.dexterity,
                                constitution: foundEnemy.constitution,
                                intelligence: foundEnemy.intelligence,
                                wisdom: foundEnemy.wisdom,
                                charisma: foundEnemy.charisma
                            });
                        }
                    } else {
                        message.reply(`Invalid argument provided! ${enemyInput} is not valid`);
                        return;
                    }
                } else {
                    //Add a single enemy of the requested type
                    const foundEnemy = await Enemies.findOne({ where: { name: enemyInput } });
                    if (foundEnemy) {
                        const calcHp = calculateHealth(foundEnemy.baseDamage, foundEnemy.constitution);
                        const verify = await Foes.create({
                            name: enemyInput,
                            currentHP: calcHp,
                            maxHP: calcHp,
                            enemyType: enemyInput,
                            baseDamage: foundEnemy.baseDamage,
                            attackDescription: foundEnemy.attackDescription,
                            strength: foundEnemy.strength,
                            dexterity: foundEnemy.dexterity,
                            constitution: foundEnemy.constitution,
                            intelligence: foundEnemy.intelligence,
                            wisdom: foundEnemy.wisdom,
                            charisma: foundEnemy.charisma
                        });

                    } else {
                        message.reply(`Invalid argument provided! ${enemyInput} is not valid`);
                        return;
                    }
                }
            }

            message.author.send(`Enemies added to the Foes table!`);
        } else {
            //If no arguments provided, display current Foes table

            //DM user the table of foes
            const foesList = await Foes.findAll();

            if (foesList.length > 0) {
                const foesEmbed = new Discord.RichEmbed()
                    .setColor('#9900cc') //Purple
                    .setTitle(`Enemy Table`)
                    .setDescription(`List of Enemies`);

                for (var i = 0; i < foesList.length; i++) {
                    foesEmbed.addField(`__**${foesList[i].name}**__`,
                        `HP: ${foesList[i].currentHP}/${foesList[i].maxHP}
                    Enemy Type: ${foesList[i].enemyType}`);
                }
                message.channel.send(foesEmbed);
            } else {
                message.channel.send(`Currently not in combat with any enemies. Add combatants by typing \`!encounter [enemyName](#[quantity])\`\nYou can also see the list of available enemy types by typing \`!enemies\``);
            }
        }
    }
}