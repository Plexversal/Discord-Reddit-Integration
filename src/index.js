require('dotenv').config();
const fs = require("fs").promises;
const discord = require('discord.js');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"], fetchAllMembers: true, disableEveryone: true});
const config = require('./config.json');
const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm')
const path = require('path');


client.commands = new discord.Collection();

const redditClient = new snoowrap({
  userAgent: `${process.env.REDDIT_USERAGENT}`,
  clientId: `${process.env.REDDIT_CLIENTID}`,
  clientSecret: `${process.env.REDDIT_CLIENTSECRET}`,
  username: `${process.env.REDDIT_USERNAME}`,
  password: `${process.env.REDDIT_PASSWORD}`
});

// command handler
fs.readdir('./commands/')
    .then(files => {
      
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
      console.log("Unable to find 'commands' file.")
      return;
    }
  
    jsfile.forEach((f, i) => {
      let props = require(`./commands/${f}`);
      console.log(` <FILE> :  ${f} loaded.`)
      client.commands.set(props.help.name, props);
    });
    console.log(`\n---All commands loaded!---\n`)
  }).catch(e => console.log(e));
  
  // event handler
  fs.readdir('./events/').then(files => {
    files.forEach(f => {
      if(!f.endsWith(`.js`)) return;
      const event = require(`./events/${f}`)
      const eventName = f.split(`.`)[0];
      console.log(` <FILE> :  ${f} loaded.`);
      client.on(eventName, event.bind(null, client))
      
    });
    console.log(`\n---All events loaded!---\n`);
  }).catch(e => console.log(e));

fs.readdir(path.join(__dirname, 'handlers'))
.then(files => {
  files.filter(f => f === `SubmissionStream.js`).forEach(f => {
    let name = f.substring(0, f.indexOf('.js'))
    console.log(name)
    let module = require(path.join(__dirname, 'handlers', name))

    console.log(`${name} Handler Loaded.`)

    const submissions = new snoostorm.SubmissionStream(redditClient, { subreddit: config.subreddit.join('+'), limit: 8, pollTime: 5000 })
    console.log(`Watching following subreddits: ${config.subreddit.join(', ')}`)
    submissions.on('item', module.bind(null, client, redditClient));
  })
}).catch(e => console.log(e));

client.login(process.env.DISCORD_TOKEN); 
