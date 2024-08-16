const { prisma } = require('@/configs/database');
const{autobuyMessage,unableToTrack,autobuyAmount}=require("./message")



const isChannel= async(userID,channelId)=>{ 
    try {
    // Attempt to find a UserChannel entry matching both userId and channelId
    const userChannel = await prisma.userChannel.findFirst({
        where: {
            AND: [
                { user_id: userID.toString() },
                { channel_id: channelId }
            ]
        }
    });

    // Check if an entry was found
    if (userChannel) {
       
        return "✅";
    } else {
        
        return "❌";
    }
} catch (error) {
    console.error("Error verifying UserChannel existence:", error);
    return "❌";  // Return false if there was an error during the process
} finally {
    await prisma.$disconnect();
}
}
async function track(bot, userId, channelId,codename,codename) {
    // Ensure correct data types
    channelId = parseInt(channelId); // Make sure channelId is an integer
    userId = userId.toString(); // Make sure userId is a string

    // Adjust this line to use your actual database connection method
    // First, try to find the user-channel pair in the database
    const found = await prisma.userChannel.findUnique({
        where: {
            user_id_channel_id: {
                user_id: userId,
                channel_id: channelId,
            },
        },
    });

    // If the user-channel pair exists, delete it
    if (found) {
        await prisma.userChannel.delete({
            where: {
                user_id_channel_id: {
                    user_id: userId,
                    channel_id: channelId,
                },
            },
        });
        bot.sendMessage(parseInt(userId), "Channel Untracked ❌");
        
        
        return 'Deleted';
    } else {
        // If the user-channel pair doesn't exist, create it
        await prisma.userChannel.create({
            data: {
                user_id: userId,
                channel_id: channelId,
            },
        });
        bot.sendMessage(parseInt(userId), "Channel Tracked ✅");
        
         // Notify the user
        return 'Added';
    }
}
const autobuy=async (bot, userId, channelId)=>{channelId = parseInt(channelId); // Make sure channelId is an integer
userId = userId.toString(); // Make sure userId is a string

// Adjust this line to use your actual database connection method
// First, try to find the user-channel pair in the database
const found = await prisma.userChannel.findUnique({
    where: {
        user_id_channel_id: {
            user_id: userId,
            channel_id: channelId,
        },
    },
});
if (found) {
    
    autobuyamount(bot,userId,channelId)
} else {
    // If the user-channel pair doesn't exist, create it
    
    bot.sendMessage(parseInt(userId), unableToTrack);
     // Notify the user
    return 'Added';
}
}
const autobuyamount = async (bot, userId, channelId) => {
    const chatId = parseInt(userId); // Ensure chatId is an integer, Telegram user IDs are integers

    // Request the autobuy amount from the user
    bot.sendMessage(chatId, autobuyAmount, {
        reply_markup: {
            force_reply: true,
        },
    }).then(sentMessage => {
        // Listen for the reply to the specific message
        bot.onReplyToMessage(chatId, sentMessage.message_id, async (reply) => {
            // Convert reply to a number, assuming amount should be a numeric value
            const newAmount = parseFloat(reply.text);
            if (!isNaN(newAmount)) { // Check if the reply is a valid number
                // Update the amount in the database
                await prisma.userChannel.update({
                    where: {
                        user_id_channel_id: {
                            user_id: userId.toString(), // Assuming user_id is stored as a String
                            channel_id: channelId, // Assuming channel_id is already an integer
                        },
                    },
                    data: { amount: newAmount }
                });
                // Confirm the new amount to the user
                if (newAmount==0){bot.sendMessage(chatId, `Autobuy is disabled ❌.`);}
                else{
                    bot.sendMessage(chatId, autobuyMessage(newAmount));}
            } else {
                // Inform the user if the reply was not a valid number
                bot.sendMessage(chatId, "Please enter a valid number.");
            }
        });
    }).catch(error => {
        console.error('Error sending message:', error);
    });
};

// Adjust based on actual functions you want to export


module.exports={isChannel,track,autobuy}