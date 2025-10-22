const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("open the shop"),

    async execute(interaction){
        const embed = new EmbedBuilder()
            .setTitle("🏪 GAMEEY SHOP")
            .setDescription(
                "```diff\n+ Welcome to the Shop!\n```\n" +
                "**💰 Premium Items Available**"
            )
            .setColor("#9B59B6")
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                {
                    name: "Security Items",
                    value: [
                        `👮 **Police Badge**\n5,000gameeys`,
                        `🎫 **Trade Pass**\n3,000gameeys`,
                    ].join('\n'),
                    inline: false
                },
                {
                    name: "Power Items",
                    value: [
                        `🧪 **Loot Potion**\n 8,000 gameeys`, 
                        `⚡ **Gameey Dev**\n10,000 gameeys`, 
                        `🔓 **Hacker**\n12,000 gameeys`,
                    ].join('\n'),
                    inline: false
                },
                {
                    name: "Quick Guide",
                    value: "```yaml\n1. Check /profile\n2. Click buttons below\n3. Use in /startdg```",
                    inline: false
                },
            )
            .setFooter({ 
                text: `${interaction.user.username} • Gameeys may change`, 
                iconURL: interaction.user.displayAvatarURL() 
            })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('buy_police')
                    .setLabel('Police • 5k')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('👮'),
                new ButtonBuilder()
                    .setCustomId('buy_trade')
                    .setLabel('Pass • 3k')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎫'),
                new ButtonBuilder()
                    .setCustomId('buy_potion')
                    .setLabel('Potion • 8k')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🧪'),
                new ButtonBuilder()
                    .setCustomId('buy_dev')
                    .setLabel('Dev • 10k')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⚡'),
                new ButtonBuilder()
                    .setCustomId('buy_hacker')
                    .setLabel('Hack • 12k')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔓')
            );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};