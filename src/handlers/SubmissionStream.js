const startTime = new Date().getTime()
const config = require('../config.json')
const discord = require('discord.js');


module.exports = (client, redditClient, submission) => {
    if((submission.created_utc * 1000) < startTime) return;

        console.log(submission.author.name)
        console.log(`https://reddit.com${submission.permalink}`)
        console.log(submission)

        let embed = new discord.MessageEmbed()
        .setColor('#0000FF')
        .setDescription(`[**${submission.title}**](https://reddit.com${submission.permalink})`)
        .addFields([
            {name: `Author`, value: `${submission.author.name}`, inline: false},
            {name: `Flair`, value: `${submission.link_flair_text}`, inline: false},
            {name: `subreddit`, value: `${submission.subreddit_name_prefixed}`, inline: false},
            {name: `spoiler`, value: `${submission.spoiler}`, inline: false},
            {name: `locked`, value: `${submission.locked}`, inline: false},
            {name: `has premium`, value: `${submission.author_premium}`, inline: false}
        ])
        .setThumbnail(submission.url_overridden_by_dest ? submission.url_overridden_by_dest : ``)
        .setTimestamp()
        .setTitle('New Submission')

        client.channels.fetch(config['channels'][0])
        .then(c => c.send({ embeds: [embed] }))

        /*
        - Here you can either replace the above code, modify the embeds and data.
        - You can put console.log(submission) to view the submission object data and what you can output.
        - You can filter posts you see by flairs and such using simple if statements, so play around with it.
        */
      
}