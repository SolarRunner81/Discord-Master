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
    name: 'createCharacter',
    description: 'Make a person without the sin',
    async execute(message, CharacterSheets) {
        const filter = m => m.author.id === message.author.id;
        var character = {}

        message.reply(`Please enter your character's name`).then(() => {
            message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                .then(async function (collected) {
                    character.name = collected.first().content;
                    console.log(`Value: ${character.name}`);
                    //Verify the user has not made this character with this character name yet
                    const check = await CharacterSheets.findOne({ where: { name: character.name } });
                    if(check) {
                        throw `The name ${character.name} has already been used!`;
                    }
                    return character;
                })
                .then(async function (character) {
                    message.channel.send(`Now the Class`);
                    message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                        .then(collected => {
                            character.class = collected.first().content;
                            console.log(`Value: ${character.class}`);
                            return character;
                        })
                        .then(function (character) {
                            message.channel.send(`Now the Level`);
                            message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                .then(collected => {
                                    character.level = collected.first().content;
                                    console.log(`Value: ${character.level}`);
                                    return character;
                                })
                                .then(function (character) {
                                    message.channel.send(`Now the Race`);
                                    message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                        .then(collected => {
                                            character.race = collected.first().content;
                                            console.log(`Value: ${character.race}`);
                                            return character;
                                        })
                                        .then(function (character) {
                                            message.channel.send(`Now the Alignment`);
                                            message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                                .then(collected => {
                                                    character.alignment = collected.first().content;
                                                    console.log(`Value: ${character.alignment}`);
                                                    return character;
                                                })
                                                .then(function (character) {
                                                    message.channel.send(`Now the Strength`);
                                                    message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                                        .then(collected => {
                                                            character.strength = collected.first().content;
                                                            console.log(`Value: ${character.strength}`);
                                                            return character;
                                                        })
                                                        .then(function (character) {
                                                            message.channel.send(`Now the Dexterity`);
                                                            message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                                                .then(collected => {
                                                                    character.dexterity = collected.first().content;
                                                                    console.log(`Value: ${character.dexterity}`);
                                                                    return character;
                                                                })
                                                                .then(function (character) {
                                                                    message.channel.send(`Now the Constitution`);
                                                                    message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                                                        .then(collected => {
                                                                            character.constitution = collected.first().content;
                                                                            console.log(`Value: ${character.constitution}`);;
                                                                            return character;
                                                                        })
                                                                        .then(function (character) {
                                                                            message.channel.send(`Now the Intelligence`);
                                                                            message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                                                                .then(collected => {
                                                                                    character.intelligence = collected.first().content;
                                                                                    console.log(`Value: ${character.intelligence}`);
                                                                                    return character;
                                                                                })
                                                                                .then(function (character) {
                                                                                    message.channel.send(`Now the Wisdom`);
                                                                                    message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                                                                        .then(collected => {
                                                                                            character.wisdom = collected.first().content;
                                                                                            console.log(`Value: ${character.wisdom}`);
                                                                                            return character;
                                                                                        })
                                                                                        .then(function (character) {
                                                                                            message.channel.send(`Now the Charisma`);
                                                                                            message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: [`time`] })
                                                                                                .then(collected => {
                                                                                                    character.charisma = collected.first().content;
                                                                                                    console.log(`Value: ${character.charisma}`);
                                                                                                    return character;
                                                                                                })
                                                                                                .then(async function (character) {
                                                                                                    //upload character to database
                                                                                                    const characterSheet = await CharacterSheets.create({
                                                                                                        name: character.name,
                                                                                                        owner: message.author.id,
                                                                                                        class: character.class,
                                                                                                        level: character.level,
                                                                                                        race: character.race,
                                                                                                        alignment: character.alignment,
                                                                                                        strength: character.strength,
                                                                                                        dexterity: character.dexterity,
                                                                                                        constitution: character.constitution,
                                                                                                        intelligence: character.intelligence,
                                                                                                        wisdom: character.wisdom,
                                                                                                        charisma: character.charisma
                                                                                                    });

                                                                                                    message.channel.send(`Character Sheet for **${characterSheet.name}** was successfully created!`);
                                                                                                })
                                                                                        })
                                                                                        .catch(() => {
                                                                                            message.channel.send(`Time has expired`);
                                                                                        });
                                                                                })
                                                                                .catch(() => {
                                                                                    message.channel.send(`Time has expired`);
                                                                                });
                                                                        })
                                                                        .catch(() => {
                                                                            message.channel.send(`Time has expired`);
                                                                        });
                                                                })
                                                                .catch(() => {
                                                                    message.channel.send(`Time has expired`);
                                                                });
                                                        })
                                                        .catch(() => {
                                                            message.channel.send(`Time has expired`);
                                                        });
                                                })
                                                .catch(() => {
                                                    message.channel.send(`Time has expired`);
                                                });
                                        })
                                        .catch(() => {
                                            message.channel.send(`Time has expired`);
                                        });
                                })
                                .catch(() => {
                                    message.channel.send(`Time has expired`);
                                });
                        })
                        .catch(() => {
                            message.channel.send(`Time has expired`);
                        });
                })
                .catch(function(error) {
                    if(error) {
                        message.channel.send(`Error thrown: ${error}`);
                    } else {
                        message.channel.send(`Time has expired`);
                    }
                });
        })
    },

};