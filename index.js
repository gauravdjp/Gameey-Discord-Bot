const {Client, Collection, Events, GatewayIntentBits, MessageFlags, SlashCommandBuilder, InteractionCreate, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const connectDB = require("./database");
require('dotenv').config();
const func = require('./function_inventory');

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],    
});
let users;


//on ready event shit
client.on("clientReady", async()=>{
    console.log("logged in..")
    const db = await connectDB();
    users = db.collection("users");
});



//command shit
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});



//button interaction shit
/*
client.on("interactionCreate", async interaction =>{
    if(!interaction.isButton()) return;

	if(interaction.customId.startsWith('buy_')) {
        await func.shop_items(interaction, users, interaction.customId);
        return;
    }
    const outcome_items = ["gameey", "items", "theft", 'end'];
    const outcome_weight = [40,40,18,2];
    const item = func.currentItem;
    if(item === null){
        await func.door_outcomes(interaction, users,outcome_items, outcome_weight);
    }
    else{
        const arrays = await func.item_outcomes(item, interaction, users);
        if(arrays){const new_outcome_items = arrays.outcome_items;
        const new_outcome_weight = arrays.outcome_weight;
        await func.door_outcomes(interaction, users,new_outcome_items, new_outcome_weight);}
    }

    
});*/
// ...existing code...

//button interaction shit
client.on("interactionCreate", async interaction => {
    if(!interaction.isButton()) return;

    try {
        // Handle shop buttons first
        if(interaction.customId.startsWith('buy_')) {
            await func.shop_items(interaction, users, interaction.customId);
            return;
        }

		if(interaction.customId.startsWith('trade_')){
			await func.trade_items(interaction, users, interaction.customId);
			return;
		}

        // Get user data to check inventory
        const userData = await users.findOne({ id: interaction.user.id });
        if (!userData) {
            await interaction.reply("Could not find user data!");
            return;
        }

        const outcome_items = ["gameey", "items", "theft", 'end'];
        const outcome_weight = [48,35,15,2];
        const item = func.currentItem;

        // If an item is selected, verify user has it
        if(item !== null) {
            // Check if user has the item
            if (!userData.items || userData.items[item] <= 0) {
                await interaction.reply({ 
                    content: `You don't have any ${item} in your inventory!`,
                    flags: MessageFlags.Ephemeral 
                });
                return;
            }

            // Deduct the item after verification
            await users.updateOne(
                { id: interaction.user.id },
                { $inc: { [`items.${item}`]: -1 } }
            );

            const arrays = await func.item_outcomes(item, interaction, users);
            if(arrays) {
                await func.door_outcomes(interaction, users, arrays.outcome_items, arrays.outcome_weight);
            }
        } else {
            await func.door_outcomes(interaction, users, outcome_items, outcome_weight);
        }
    } catch(error) {
        console.error('Error in button interaction:', error);
        await interaction.reply({ 
            content: 'There was an error processing your request!',
            flags: MessageFlags.Ephemeral 
        });
    }
});





//bro coming to world shit
client.login(process.env.TOKEN);