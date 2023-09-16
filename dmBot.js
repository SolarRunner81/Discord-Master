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

const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const { prefix, token } = require('./config.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

const CharacterSheets = sequelize.import('tables/CharacterSheets');
const Weapons = sequelize.import('tables/Weapons');
const Spells = sequelize.import('tables/Spells');
const Events = sequelize.import('tables/Events');
const Enemies = sequelize.import('tables/Enemies');
const Party = sequelize.import('tables/Party');
const Foes = sequelize.import('tables/Foes');

client.once('ready', () => {
  CharacterSheets.sync();
  Weapons.sync();
  Spells.sync();
  Events.sync();
  Enemies.sync();
  Party.sync();
  Party.destroy({
    where: {},
    truncate: true
  });
  Foes.sync();
  Foes.destroy({
    where: {},
    truncate: true
  });
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  //if there is no prefix or message is from a bot, ignore the message
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  //slice the off the prefix entirely and then split it into an array by spaces
  const args = message.content.slice(prefix.length).split(' ');
  //take the first element and return it while removing it from the original array
  const command = args.shift().toLowerCase();

  //COMMANDS
  switch (command) {
    case 'ping':
      client.commands.get('ping').execute(message, args);
      break;
    case 'avatar':
      const user = getUserFromMention(args[0]);
      client.commands.get('avatar').execute(message, user);
      break;
    case 'createcharacter':
      client.commands.get('createCharacter').execute(message, CharacterSheets);
      break;
    case 'getcharacter':
      client.commands.get('getCharacter').execute(message, args[0], CharacterSheets);
      break;
    case 'equipment':
      client.commands.get('equipment').execute(message, args[0], args[1], args[2], CharacterSheets, Weapons, Spells);
    break;
    case 'event':
      client.commands.get('event').execute(message, Events, args[0]);
      break;
    case 'roll':
      var diceValues = {};
      var reason = ``;
      if (args[1]) {
        var i;
        for (i = 1; i < args.length; i++) {
          reason += `${args[i]} `;
        }
      } else {
        reason = `${message.author.username}'s roll`
      }
      if (args[0]) {
        diceValues = splitRollValues(message, args[0]);
        if (diceValues != -1) {
          client.commands.get('roll').execute(message, diceValues.quantity, diceValues.faceValue, diceValues.modifier, reason);
        }
      } else {
        client.commands.get('roll').execute(message, 1, 20, 0, reason);
      }
      break;
    case 'party':
      client.commands.get('party').execute(message, Party, client, Discord);
      break;
    case 'partyup':
      client.commands.get('partyUp').execute(message, args[0], CharacterSheets, Party);
      break;
    case 'disband':
      client.commands.get('disband').execute(message, Party);
      break;
    case 'enemies':
      client.commands.get('enemies').execute(message, Enemies);
      break;
    case 'encounter':
      client.commands.get('encounter').execute(message, args, Enemies, Foes);
      break;
    default:
      message.reply("That's not a valid command!");
  }

});

function getUserFromMention(mention) {
  if (!mention) return;

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }

    return client.users.get(mention);
  }
}

function splitRollValues(message, dice) {
  if (!dice) return -1;
  var output = {
    quantity: 0,
    faceValue: 0,
    modifier: 0
  };
  var roll = dice.split('d', 2);
  console.log(`# of dice: ${roll[0]}, sides of dice: ${roll[1]}`);

  //if the number of dice is not declared, assume 1
  if (roll[0] === '') {
    output.quantity = 1;
  } else if (isNaN(roll[0])) {
    message.reply("Syntax should be \`!roll [# of dice]d[max value]+[optional modifier] Optional String\`");
    return -1;
  } else {
    output.quantity = roll[0];
  }

  if (roll[1].indexOf('+') > -1) {
    var temp = roll[1].split('+');
    if (temp[0] === '') {
      output.faceValue = 20;
    } else if (isNaN(temp[0])) {
      message.reply("Syntax should be \`!roll [# of dice]d[max value]+[optional modifier] Optional String\`");
      return -1;
    } else {
      output.faceValue = temp[0];
    }

    var i;
    output.modifier = 0;
    for (i = 1; i < temp.length; i++) {
      if (isNaN(temp[i])) {
        console.log(`The ${i} position is not a value: ${temp[i]}`);
        return -1;
      } else {
        output.modifier += parseInt(temp[i]);
      }
    }

  } else {
    if (roll[1] === '') {
      output.faceValue = 20;
    } else if (isNaN(roll[1])) {
      message.reply("Syntax should be \`!roll [# of dice]d[max value]+[optional modifier] Optional String\`");
      return -1;
    } else {
      output.faceValue = roll[1];
    }
  }

  return output;
}

client.login(token);


/**TODO:
 * - events
 * - encounters
 * - help command
 * - Level up
**/