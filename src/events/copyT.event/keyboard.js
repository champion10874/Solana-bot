const { isChannel } = require('./verifier');

async function channelKeyboard(userId, 
    channels) 
    {
    const promises = channels.map(async (ch) => {
        const channelExists = await isChannel(userId, ch.id);
       
         // Await the asynchronous check
        return {
            text: `${channelExists} ${ch.name} `,
            callback_data: `show ${ch.id} ${ch.codename} ${ch.name}`, // Modify this as needed
        };

    });

    // Wait for all the promises from the map to resolve
    const strategiesKeyboard = await Promise.all(promises);

    // Group buttons into rows of three
    const rows = [];
    for (let i = 0; i < strategiesKeyboard.length; i += 3) {
        rows.push(strategiesKeyboard.slice(i, i + 3));
    }

    return rows;
}



const trackkeyboard= (chid,
    codename,
    chname)=>
    {
    return[[{text: `📍 track `,callback_data: `track ${chid} ${codename} ${chname}`},{text: `🛒 autobuy `,callback_data: `autobuy ${chid}`}]]
}
module.exports = { channelKeyboard ,trackkeyboard};
