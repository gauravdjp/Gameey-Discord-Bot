const {SlashCommandBuilder} = require('discord.js');
const connectDB = require('../../database');

module.exports = {
    data : new SlashCommandBuilder()
    .setName("register")
    .setDescription("register for storing game data"),

    async execute(interaction) {
        const db = await connectDB();
        const users = db.collection("users");
        const user_id = interaction.user.id;
        let existingone = await users.findOne({id: user_id});
        if(!existingone){
            await users.insertOne({id: user_id, gameey:1000, items:{police:0, trade_pass:0, loot_potion:0, gameey_dev:0, hacker:0}});
            await interaction.reply(`<@${user_id}> added successfully!!`);
        }
        else{
            await interaction.reply("username already exists!!!");
        }
    },

};