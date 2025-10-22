const {EmbedBuilder, SlashCommandBuilder, MessageFlags} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("about the game"),
        
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🎮 GAMEEY Guide')
            .setDescription(
                '**Welcome to GAMEEY!**\n\n' +
                '```diff\n+ The Ultimate Discord Game\n- Read below to start playing\n```'
            )
            .addFields(
                {
                    name: '📝 Basic Commands',
                    value: '`/register` - Create account\n`/profile` - View stats\n`/shop` - Buy items\n`/trade` - Trade items',
                    inline: false
                },
                {
                    name: '🎲 How To Play',
                    value: '```/startdg - Start Game\n• Pick 1 of 4 doors\n• Use items for better odds\n• Win gameeys & items```',
                    inline: false
                },
                {
                    name: '🎒 Items Guide',
                    value: '```👮 Police - No theft\n🎫 Trade Pass - Trade centre access\n🧪 Potion - Big wins\n⚡ Dev - Full safety\n🔓 Hacker - Escape end door```',
                    inline: false
                },
                {
                    name: '💡 Quick Tips',
                    value: '```diff\n+ First explore/find or buy items\n+ Use Trade Pass to buy items cheaper\n+ Use Police Badge early\n+ Save Potions for later\n- Avoid playing without items```',
                    inline: false
                }
            )
            .setColor('#8B5CF6')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({
                text: 'Type /help anytime to see this guide',
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({ 
            embeds: [embed],
            
        });
    }
};