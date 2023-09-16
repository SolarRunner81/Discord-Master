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

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Enemies', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        baseDamage: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        attackDescription: {
            type: DataTypes.STRING,
        },
        strength: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        dexterity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        constitution: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        intelligence: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        wisdom: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        charisma: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    });
};