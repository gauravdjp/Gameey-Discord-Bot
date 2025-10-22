function weightedRandom(items, weights) {
    if (!Array.isArray(weights) || !Array.isArray(items)) {
        console.error('Invalid parameters:', { items, weights });
        throw new Error('Both items and weights must be arrays');
    }
    const total = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * total; 
    let sum = 0;

    for (let i = 0; i < items.length; i++) {
        sum += weights[i];
        if (rand < sum) return items[i];
    }
}

async function door_outcomes(interaction, users, outcome_items, outcome_weight){
    const result = weightedRandom(outcome_items, outcome_weight);
    if(result === "gameey"){
        const gameey = [0,5,10,50,100,250,300,500,750,800,1000];
        const result_gameey = weightedRandom(gameey, [20,20,15,10,10,8,5,5,4,2,1]);
        await interaction.reply(`YOU GOT ${result_gameey} gameeys`);
        await users.updateOne({ id : interaction.user.id }, { $inc: { gameey : result_gameey } });
        return;
    }
    else if(result === "items"){
        const items = ["police", "trade_pass", "loot_potion", "gameey_dev", "hacker"];
        const items_weight = [35,35,20,8,2];
        const result_item = weightedRandom(items, items_weight);
        await interaction.reply(`YOU GOT ${result_item}`);
        await users.updateOne({ id : interaction.user.id }, { $inc: { [`items.${result_item}`]:1 } });
        return;
    }
    else if(result === "theft"){
        await interaction.reply("YOU GOT ROBBED, YOU LOST ALL YOUR GAMEEYS");
        await users.updateOne({ id : interaction.user.id }, { $set: { gameey : 0 } });
        return;
    }
    else if(result === "end"){
        await interaction.reply("SORRY DUDE, ITS END, NO MORE GAME FOR YOU");
        await users.deleteOne({ id : interaction.user.id });
        return;
    }
    else{
        await interaction.reply("something went wrong");
        return;
    }
}


async function item_outcomes(item, interaction, users){
    if(item === "police"){
        return {outcome_items:["gameey", "items", "end"], outcome_weight:[54,44,2]};
    }
    else if(item ==="trade_pass"){
        await interaction.reply('you cannot use this item here, only in trade command');
        return;
    }
    else if(item ==="loot_potion"){
        const gameey = [500,1000, 2000, 2500, 5000];
        const outcome_weight = [30,30,20,10,10];
        const result = weightedRandom(gameey, outcome_weight);
        await interaction.reply(`YOU GOT ${result} gameeys`);
        await users.updateOne({ id : interaction.user.id }, { $inc: { gameey : result } });
        
    }
    else if(item ==="gameey_dev"){
        return{outcome_items:["gameey", "items"], outcome_weight:[50,50]};
    }
    else if(item === "hacker"){
        return{outcome_items:["gameey", "items", "theft"], outcome_weight:[50,40,10]};
    }
    else{
        await interaction.reply("something went wrong");
    }  
}

async function shop_items(interaction, users, customid){
    const userData = await users.findOne({ id: interaction.user.id });
    if (!userData) {
        await interaction.reply("Could not find user data!");
        return;
    }

    if(customid === "buy_police"){
        if(userData.gameey >= 5000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -5000, 'items.police': 1 } });
            await interaction.reply("You bought a police security!");
            return;
        }
        else{
            await interaction.reply("You don't have enough gameeys (need 5000)");
            return;
        }
    }
    else if(customid === "buy_trade"){
        if(userData.gameey >= 3000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -3000, 'items.trade_pass': 1 } });
            await interaction.reply("You bought a trade pass, trade securely with other players!");
            return;
        }
        else {
            await interaction.reply("You don't have enough gameeys (need 2000)");
            return;
        }
    }
    else if(customid === "buy_potion"){
        if(userData.gameey >= 8000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -8000, 'items.loot_potion': 1 } });
            await interaction.reply("You bought a loot potion, use it to get high gameey rewards!");
            return;
        }
        else{
            await interaction.reply("You don't have enough gameeys (need 8000)");
            return;
        }
    }
    else if(customid === "buy_dev"){
        if(userData.gameey >= 10000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -10000, 'items.gameey_dev': 1 } });
            await interaction.reply("You bought a gameey dev, use it to remove the possibility of theft and end door!");
            return;
        }
        else{
           await interaction.reply("You don't have enough gameeys (need 10000)"); 
           return;
        }
    }
    else if(customid === "buy_hacker"){
        if(userData.gameey >= 12000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -12000, 'items.hacker': 1 } });
            await interaction.reply("You bought a hacker, use it to increase all rewards but adds risk of theft!");
            return;
        }
        else{
            await interaction.reply("You don't have enough gameeys (need 7500)");
            return;
        }
    }
    else{
        await interaction.reply("Something went wrong with the purchase");
        return;
    }
}


async function trade_items(interaction, users, customid){
    const userData = await users.findOne({ id: interaction.user.id });
    if (!userData) {
        await interaction.reply("Could not find user data!");
        return;
    }

    if(customid === "trade_police"){
        if(userData.gameey >= 1000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -1000, 'items.police': 1 } });
            await interaction.reply("You bought a police security!");
            return;
        }
        else{
            await interaction.reply("You don't have enough gameeys (need 1000)");
            return;
        }
    }
    else if(customid === "trade_potion"){
        if(userData.gameey >= 4000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -4000, 'items.loot_potion': 1 } });
            await interaction.reply("You bought a loot potion, use it to get high gameey rewards!");
            return;
        }
        else{
            await interaction.reply("You don't have enough gameeys (need 4000)");
            return;
        }
    }
    else if(customid === "trade_dev"){
        if(userData.gameey >= 5000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -5000, 'items.gameey_dev': 1 } });
            await interaction.reply("You bought a gameey dev, use it to remove the possibility of theft and end door!");
            return;
        }
        else{
           await interaction.reply("You don't have enough gameeys (need 5000)"); 
           return;
        }
    }
    else if(customid === "trade_hacker"){
        if(userData.gameey >= 6000){
            await users.updateOne({ id: interaction.user.id }, { $inc: { gameey: -6000, 'items.hacker': 1 } });
            await interaction.reply("You bought a hacker, use it to increase all rewards but adds risk of theft!");
            return;
        }
        else{
            await interaction.reply("You don't have enough gameeys (need 6000)");
            return;
        }
    }
    else{
        await interaction.reply("Something went wrong with the purchase");
        return;
    }
}

module.exports = 
{    
    weightedRandom,
    currentItem : null,
    item_outcomes,
    door_outcomes,
    shop_items,
    trade_items,

};


