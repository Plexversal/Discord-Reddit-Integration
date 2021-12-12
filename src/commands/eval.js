const config = require('../config.json')
const discord = require('discord.js');


module.exports.run = async (client, message, args) => {

    if(message.author.id !== config.owner) return;

    if(!args[0]) return message.channel.send(`Invalid code parameter`)
    
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS"))
    return message.channel.send("I do not have global attach file permissions. You will need to provide me with attach file permissions before using this command.");

    var code = args.join(" ")

    let embed = (input, output, error = false) => new discord.MessageEmbed().setColor(error ? `RED` : `GREEN`)
    .addField("Input", input)
    .addField(error ? "Error" : "Output", `\`\`\`js\n${output}\n\`\`\``)

    try {
        let evaled = await eval(code);
        if (evaled instanceof Promise) {

        evaled.then(output => {
            return message.channel.send(embed(code, output instanceof Object ? `Output fulfilled with Promise: ${util.inspect(output, false, 0, false)}` : output));
        }).catch(e => {
            return message.channel.send(embed(code, e, true));
            });
        }       
        else {
            return message.channel.send({ embeds: [embed(code, evaled instanceof Object ? `Output fulfilled with Promise: ${util.inspect(evaled, false, 0, false)}` : evaled)] });
            }
    }  
    catch (err) {
        message.channel.send({ embeds: [embed(code, err, true)] } );
    }


}

module.exports.help ={
    name: "eval"
}