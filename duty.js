const Discord = require("discord.js");
const moment = require('moment')
const configs = require("./configs.json")
const TimeSchema = require("./models/hours")
const Schema = require("./models/duty")
const mongoose = require('mongoose');

module.exports = async (akoum, message) => {
    akoum.on('message', async(message) => {
        if (!message.content.startsWith(configs.bot.PREFIX) || message.author.bot) return;
    
        const args = message.content.slice(configs.bot.PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (command === 'on'){
            if(!message.member.roles.cache.has(configs.roles.STAFF)) return message.reply(`Πρέπει να έχεις το <@&${configs.roles.STAFF}> για να εκτελέσεις αυτο το command!`);
        
            const settingsTime = await Schema.findOne({
                staffID: message.author.id
            })
    
            if(settingsTime) return message.channel.send("Είσαι σε υπηρεσία!")
    
    
            const start = new Date().getTime();
    
            schema = new Schema({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                staffID: message.author.id,
                startTime: start
                
            })
    
            const settings = await Schema.findOne({
                staffID: message.author.id
            })
        
            schema.save()
            .catch(err => console.error(err));
            message.delete()
            const onembed = new Discord.MessageEmbed()
            .setAuthor(`Staff: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Ο ${message.author} μπήκε σε υπηρεσία ${moment().format('Σημέρα: DD/MM, στις h:mm a')}`)
            .setColor(configs.embeds.COLOR)
            message.channel.send(onembed)
        } else if(command === 'off'){
            const user = message.mentions.members.first()
            if(!message.member.roles.cache.has(configs.roles.STAFF)) return message.reply(`Πρέπει να έχεις το <@&${configs.roles.STAFF}> για να εκτελέσεις αυτο το command!`);
    
            if(!user) {
    
                const settings = await Schema.findOne({
                    staffID: message.author.id
                })
        
                if(!settings) return message.channel.send("Πρέπει να είσαι σε υπηρεσία για να εκτελέσεις αυτο το command!")
                const on = settings.startTime
                const off = new Date().getTime();
                  
                const time = off - on;
        
                let days = Math.floor(time / 86400000);
                let hours = Math.floor(time / 3600000) % 24;
                let minutes = Math.floor(time / 60000) % 60;
                let seconds = Math.floor(time / 1000) % 60; 
        
                const logs = message.guild.channels.cache.get(configs.logs.DUTY)  
                const embed = new Discord.MessageEmbed()
                .setAuthor(`Staff: ${message.author.tag}`, configs.embeds.LOGO)
                .setDescription("```Duty Logs```" 
                     +
                     "\n"
                     +
                    "\n" + "**Μέρες:**" + "```" + `${days}` + "```"
                    +
                     "\n" + "**Ώρες**" + "```" + `${hours}` + "```"
                     +
                     "\n" + "**Λεπτά:**" + "```" + `${minutes}` + "```"
                     +
                    "\n" + "**Δευτερόλεπτα:**" + "```" + `${seconds}` + "```"
                   )
                   .setColor(configs.embeds.COLOR)
                   .setColor(configs.embeds.COLOR)
                   .setFooter(`${configs.embeds.NAME}`, `${configs.embeds.LOGO}`)
                   logs.send(embed)
                   message.delete({timeout: 3000})
                   const offembed = new Discord.MessageEmbed()
                    .setAuthor(`Staff: ${message.author.tag}`, configs.embeds.LOGO)
                    .setDescription(`Ο ${message.author} βγήκε από υπηρεσία ${moment().format('Σημέρα: DD/MM, στις h:mm a')}`)
                    .setColor(configs.embeds.COLOR)
                    message.channel.send(offembed)
                    Schema.findOneAndDelete({staffID: message.author.id}, function (err) {
                        if(err) console.log(err);
                      //  console.log("Successful deletion1");
                      });
        
                      const settingstimeschema1 = await TimeSchema.findOne({
                        staffID: message.author.id          
                    });
        
                    if(!settingstimeschema1) {
                        const settingstimeschema = await TimeSchema.findOne({
                            staffID: message.author.id 
                        }, (err, timeschema) => {
                            if (err) console.error(err)
                            if (!timeschema) {
                                const newTimeSchema = new TimeSchema({
                                    _id: mongoose.Types.ObjectId(),
                                    guildID: message.guild.id,
                                    staffID: message.author.id,
                                    Days: days,
                                    Hours: hours,
                                    Minutes: minutes,
                                    Seconds: seconds
                       })
                                newTimeSchema.save()
                                .catch(err => console.error(err));
                
                                
                            }
                        });
        
                    }
        
                    if(settingstimeschema1){
        
                        const settingstimeschema = await TimeSchema.findOne({
                            staffID: message.author.id          
                        });
            
                        const mathsjsdays = parse(`${settingstimeschema.Days} + ${days}`)
                        
                        const mathsjshours = parse(`${settingstimeschema.Hours} + ${hours}`)
                        const mathsjsminutes = parse(`${settingstimeschema.Minutes} + ${minutes}`)
                        const mathsjsseconds = parse(`${settingstimeschema.Seconds} + ${seconds}`)
                        let newdays = simplify(mathsjsdays)
                        let newhours = simplify(mathsjshours)
                        let newminutes = simplify(mathsjsminutes)
                        let newseconds = simplify(mathsjsseconds)
            
                        await TimeSchema.findOneAndUpdate(
                            { staffID: message.author.id },
                            { $set: { Days : newdays, Hours: newhours, Minutes: newminutes, Seconds: newseconds } }
                      
                        )
        
                    }
    
            }
    
            if(user){
                const settings = await Schema.findOne({
                    staffID: user.id
                })
        
                if(!settings) return message.channel.send("Πρέπει να είσαι σε υπηρεσία για να εκτελέσεις αυτο το command!")
                const on = settings.startTime
                const off = new Date().getTime();
                  
                const time = off - on;
        
                let days = Math.floor(time / 86400000);
                let hours = Math.floor(time / 3600000) % 24;
                let minutes = Math.floor(time / 60000) % 60;
                let seconds = Math.floor(time / 1000) % 60; 
        
                const logs = message.guild.channels.cache.get(configs.logs.DUTY)  
                const embed = new Discord.MessageEmbed()
                .setAuthor(`Staff: ${user}`, configs.embeds.LOGO)
                .setDescription("```Duty Logs```" 
                     +
                     "\n"
                     +
                    "\n" + "**Μέρες:**" + "```" + `${days}` + "```"
                    +
                     "\n" + "**Ώρες**" + "```" + `${hours}` + "```"
                     +
                     "\n" + "**Λεπτά:**" + "```" + `${minutes}` + "```"
                     +
                    "\n" + "**Δευτερόλεπτα:**" + "```" + `${seconds}` + "```"
                   )
                   .setColor(configs.embeds.COLOR)
                   .setColor(configs.embeds.COLOR)
                   .setFooter(`${configs.embeds.NAME}`, `${configs.embeds.LOGO}`)
                   logs.send(embed)
                   message.delete({timeout: 3000})
                   const offembed = new Discord.MessageEmbed()
                    .setAuthor(`Staff: ${user}`, configs.embeds.LOGO)
                    .setDescription(`Ο ${message.author} έβγαλε απο υπηρεσία τον ${user} ${moment().format('Σημέρα: DD/MM, στις h:mm a')}`)
                    .setColor(configs.embeds.COLOR)
                    message.channel.send(offembed)
                    Schema.findOneAndDelete({staffID: user.id}, function (err) {
                        if(err) console.log(err);
                      //  console.log("Successful deletion1");
                      });
        
                      const settingstimeschema1 = await TimeSchema.findOne({
                        staffID: user.id          
                    });
        
                    if(!settingstimeschema1) {
                        const settingstimeschema = await TimeSchema.findOne({
                            staffID: user.id
                        }, (err, timeschema) => {
                            if (err) console.error(err)
                            if (!timeschema) {
                                const newTimeSchema = new TimeSchema({
                                    _id: mongoose.Types.ObjectId(),
                                    guildID: message.guild.id,
                                    staffID: user.id,
                                    Days: days,
                                    Hours: hours,
                                    Minutes: minutes,
                                    Seconds: seconds
                       })
                                newTimeSchema.save()
                                .catch(err => console.error(err));
                
                                
                            }
                        });
        
                    }
        
                    if(settingstimeschema1){
        
                        const settingstimeschema = await TimeSchema.findOne({
                            staffID: user.id          
                        });
            
                        const mathsjsdays = parse(`${settingstimeschema.Days} + ${days}`)
                        const mathsjshours = parse(`${settingstimeschema.Hours} + ${hours}`)
                        const mathsjsminutes = parse(`${settingstimeschema.Minutes} + ${minutes}`)
                        const mathsjsseconds = parse(`${settingstimeschema.Seconds} + ${seconds}`)
                        let newdays = simplify(mathsjsdays)
                        let newhours = simplify(mathsjshours)
                        let newminutes = simplify(mathsjsminutes)
                        let newseconds = simplify(mathsjsseconds)
            
                        await TimeSchema.findOneAndUpdate(
                            { staffID: user.id},
                            { $set: { Days : newdays, Hours: newhours, Minutes: newminutes, Seconds: newseconds } }
                      
                        )
        
                    }
            }
        } else if(command == 'hours'){
            const user = message.mentions.members.first()

            if(!user){
    
                const settingstimeschema1 = await TimeSchema.findOne({
                    staffID: message.author.id
                })
    
                if(!settingstimeschema1){
                    const neverondutyuserembed = new Discord.MessageEmbed()
                    .setDescription(`Δυστυχώς ο ${message.author} δεν έχει πάει ποτέ εντός υπηρεσίας`)
                    .setColor(configs.embeds.COLOR)
                    return message.channel.send(neverondutyuserembed)
    
                };
    
    
                if(settingstimeschema1.Seconds > 60 ) {
                    const mathsjsminutes = parse(`${settingstimeschema1.Minutes} + 1`)
                    let newminutes1 = simplify(mathsjsminutes)
                    await TimeSchema.findOneAndUpdate(
                        { staffID: message.author.id },
                        { $set: { Minutes: newminutes1, Seconds: "0" } }    
                    )
                } else if(settingstimeschema1.Minutes > 60 ) {
                    const mathsjshours = parse(`${settingstimeschema1.Hours} + 1`)
                    let newhours1 = simplify(mathsjshours)
                    await TimeSchema.findOneAndUpdate(
                        { staffID: message.author.id },
                        { $set: { Hours: newhours1, Minutes: "0" } }    
                    )
                } else if(settingstimeschema1.Hours > 24 ) {
                    const mathsjsdays = parse(`${settingstimeschema1.Days} + 1`)
                    let newday1 = simplify(mathsjsdays)
                    await TimeSchema.findOneAndUpdate(
                        { staffID: message.author.id },
                        { $set: { Days: newday1, Hours: "0" } }    
                    )
                };
    
                setTimeout(() => {
    
                    const hours = new Discord.MessageEmbed()
                    .setDescription("**" +`Οι ώρες σου ${message.author}` + "**"
                    +
                    "\n"
                    +
                    "\n" + "**Μέρες:**" + "```" + `${settingstimeschema1.Days}` + "```"
                    +
                    "\n" + "**Ώρες**" + "```" + `${settingstimeschema1.Hours}` + "```"
                    +
                    "\n" + "**Λεπτά:**" + "```" + `${settingstimeschema1.Minutes}` + "```"
                    +
                    "\n" + "**Δευτερόλεπτα:**" + "```" + `${settingstimeschema1.Seconds}` + "```"
                 
                    )
                    .setColor(configs.embeds.COLOR)
                    .setFooter(`${configs.embeds.NAME}`, `${configs.embeds.LOGO}`)
                    message.channel.send(hours)
      
                }, 500);
                
            } else if(user){
                const settingstimeschema1 = await TimeSchema.findOne({
                    staffID: user.id
                })
    
                if(!settingstimeschema1){
                    const neverondutyuserembed = new Discord.MessageEmbed()
                    .setDescription(`Δυστυχώς ο <@!${user.id}> δεν έχει πάει ποτέ εντός υπηρεσίας`)
                    .setColor(configs.embeds.COLOR)
                    return message.channel.send(neverondutyuserembed)
    
                }
    
                if(settingstimeschema1.Seconds > 60 ) {
                    const mathsjsminutes = parse(`${settingstimeschema1.Minutes} + 1`)
                    let newminutes1 = simplify(mathsjsminutes)
                    await TimeSchema.findOneAndUpdate(
                        { staffID: user.id },
                        { $set: { Minutes: newminutes1, Seconds: "0" } }    
                    )
                } else if(settingstimeschema1.Minutes > 60 ) {
                    const mathsjshours = parse(`${settingstimeschema1.Hours} + 1`)
                    let newhours1 = simplify(mathsjshours)
                    await TimeSchema.findOneAndUpdate(
                        { staffID: user.id },
                        { $set: { Hours: newhours1, Minutes: "0" } }    
                    )
                } else if(settingstimeschema1.Hours > 24 ) {
                    const mathsjsdays = parse(`${settingstimeschema1.Days} + 1`)
                    let newday1 = simplify(mathsjsdays)
                    await TimeSchema.findOneAndUpdate(
                        { staffID: user.id },
                        { $set: { Days: newday1, Hours: "0" } }    
                    )
                };
    
                const hours = new Discord.MessageEmbed()
                .setDescription("**" +`Οι ώρες του ${user}` + "**"
                  +
                 "\n"
                 +
                 "\n" + "**Μέρες:**" + "```" + `${settingstimeschema1.Days}` + "```"
                 +
                 "\n" + "**Ώρες**" + "```" + `${settingstimeschema1.Hours}` + "```"
                 +
                 "\n" + "**Λεπτά:**" + "```" + `${settingstimeschema1.Minutes}` + "```"
                 +
                 "\n" + "**Δευτερόλεπτα:**" + "```" + `${settingstimeschema1.Seconds}` + "```"
                )
                .setColor(configs.embeds.COLOR)
                .setFooter(`${configs.embeds.NAME}`, `${configs.embeds.LOGO}`)
                message.channel.send(hours)
    
    
            }
        } else if(command == 'delete-hours'){
            if(!message.member.hasPermission("ADMINISTRATOR")){
                return message.channel.send("You must have administrator to execute this command!");
              }
                const user = message.mentions.members.first()
                
        
                if(!user){
        
                  TimeSchema.findOneAndDelete({
                    guildID: message.guild.id,
                    staffID: message.author.id
                  })         
        
                 const embed = new Discord.MessageEmbed()
                 .setDescription(`Διαγράφτηκαν οι ώρες σου ${message.author}`)
                 .setColor(configs.embeds.COLOR)
                 message.channel.send(embed);
        
                 
                } else if(user){
        
                  TimeSchema.findOneAndDelete({
                    guildID: message.guild.id,
                    staffID: user.id
                  })
        
                  const embed = new Discord.MessageEmbed()
                 .setDescription(`Διαγράφτηκαν οι ώρες του ${user} απο τον ${message.author}`)
                 .setColor(configs.embeds.COLOR)
        
                  message.channel.send(embed);
        
                }
        }
    
          
            
          
              
    
    })
}   