const Discord = require("discord.js")
const akoum = new Discord.Client()
akoum.mongoose = require('./mongoose');
const configs = require("./configs.json")
const duty = require("./duty")
duty(akoum)
akoum.on('ready',()=>{
    console.log("Bot is online!")
})
akoum.mongoose.init()
akoum.login(configs.bot.TOKEN)