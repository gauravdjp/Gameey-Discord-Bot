const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collector} = require('discord.js');
const share  = require('../../function_inventory');
module.exports = {
    data : new SlashCommandBuilder()
        .setName('startdg')
        .setDescription('starts the door game')
        .addStringOption(option => option.setName("item1").setDescription("select the item from inventory to use.")),
        //.addStringOption(option => option.setName("item2").setDescription("select the item from inventory to use.")),

    async execute(interaction){
        const item1 = interaction.options.getString('item1');
        //const item2 = interaction.options.getString('item2');
        share.currentItem = item1;

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription("CHOOSE ONE OF THE DOOR");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel(" 🚪 DOOR 1")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel(" 🚪 DOOR 2")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel(" 🚪 DOOR 3")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel(" 🚪 DOOR 4")
            .setStyle(ButtonStyle.Secondary),
        );

        const game_interaction = await interaction.reply({
            embeds : [embed], 
            components : [row],
        });

        const game_interaction_collector = game_interaction.createMessageComponentCollector(
            { max : 1 }
        );

        game_interaction_collector.on('collect', async () => {
            const disabledRow = ActionRowBuilder.from(row);
            disabledRow.components.forEach(btn => btn.setDisabled(true));

            await game_interaction.edit({ components: [disabledRow] });

        });


    },

};