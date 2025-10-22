const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const connectDB = require('../../database');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("shows game profile(inventory, balance)"),

    async execute(interaction){
        const db = await connectDB();
        const users = db.collection("users");
        const user_id = interaction.user.id;
        const guser = await users.findOne({id: user_id});

        const embed = new EmbedBuilder()
            .setTitle(`🎮 ${interaction.user.username}'s Profile`)
            .setDescription(`💰 Balance: **${guser.gameey.toLocaleString()} gameeys**\n\n🎒 **YOUR ITEMS:**`)
            .setColor("#FF5757")
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { 
                    name: "Security Items",
                    value: `👮 Police Badge: \`${guser.items.police}\`\n🎫 Trade Pass: \`${guser.items.trade_pass}\``,
                    inline: false 
                },
                { 
                    name: "Power Items",
                    value: `🧪 Loot Potion: \`${guser.items.loot_potion}\`\n⚡ Gameey Dev: \`${guser.items.gameey_dev}\`\n🔓 Hacker: \`${guser.items.hacker}\``,
                    inline: false 
                },
                {
                    name: "Quick Actions",
                    value: "```/startdg - Play\n/shop - Buy\n/trade - Trade```",
                    inline: false
                }
            )
            .setFooter({ 
                text: "Use /help for game guide", 
                iconURL: interaction.client.user.displayAvatarURL() 
            })
            .setTimestamp();
    
        await interaction.reply({
            embeds: [embed]
        });
    }
};