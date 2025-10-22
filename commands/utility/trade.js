const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, MessageFlags} = require('discord.js');
const connectDB = require('../../database');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("trade")
        .setDescription("open the trade centre"),

    async execute(interaction){

        const db = await connectDB();
        const users = db.collection("users");
        const userData = await users.findOne({ id: interaction.user.id });

        if(!userData) {
            await interaction.reply({ 
                content: "You need to register first! Use /register", 
                ephemeral: true 
            });
            return;
        }

        if(!userData.items.trade_pass || userData.items.trade_pass < 1) {
            await interaction.reply({ 
                content: "❌ You need a Trade Pass to access the Trade Centre!\nBuy one from the `/shop` first.", 
                ephemeral: true 
            });
            return;
        }

        await users.updateOne(
            { id: interaction.user.id },
            { $inc: { 'items.trade_pass': -1 } }
        );
        const embed = new EmbedBuilder()
            .setTitle("🏦 TRADE CENTRE")
            .setDescription(
                "```diff\n+ Welcome to Discounted Trading!\n- Trade Pass Consumed\n```" +
                "**💎 SPECIAL OFFERS:**"
            )
            .setColor("#2ECC71")
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                {
                    name: "Security Items",
                    value: [
                        "👮 **Police Badge** • 1,000 gameeys",
                        "🧪 **Loot Potion** • 4,000 gameeys",
                    ].join('\n'),
                    inline: false
                },
                {
                    name: "Premium Items",
                    value: [
                        "⚡ **Gameey Dev** • 5,000 gameeys",
                        "🔓 **Hacker** • 6,000 gameeys",
                    ].join('\n'),
                    inline: false
                },
                {
                    name: "Trade Rules",
                    value: "```yaml\n• Limited time offers\n• One purchase per item\n• All sales are final```",
                    inline: false
                }
            )
            .setFooter({ 
                text: `${interaction.user.username} • Trade Session Active`, 
                iconURL: interaction.user.displayAvatarURL() 
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('trade_police')
                    .setLabel('Police • 1k')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('👮'),
                new ButtonBuilder()
                    .setCustomId('trade_potion')
                    .setLabel('Potion • 4k')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🧪'),
                new ButtonBuilder()
                    .setCustomId('trade_dev')
                    .setLabel('Dev • 5k')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⚡'),
                new ButtonBuilder()
                    .setCustomId('trade_hacker')
                    .setLabel('Hack • 6k')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔓')
            );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};