const config = require('../config.json')

module.exports = async (client, message) => {

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
  
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);
  
    if(!command.startsWith(config.prefix)) return;
  
    let cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase())
    if(cmd) cmd.run(client, message, args)
}