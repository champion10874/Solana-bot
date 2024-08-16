const{channelKeyboard,trackkeyboard}= require('./keyboard');
const { prisma } = require('@/configs/database');
const {channelmessage,selectionMessage}=require('./message');
const { isChannel } = require('./verifier');




const showChannel= async(bot,chatId) =>{
  const channels = await prisma.channels.findMany();
  console.log(channels)
    
    bot.sendMessage(chatId, selectionMessage, {
        
        reply_markup: {
          inline_keyboard: await channelKeyboard(chatId,channels),
        },
      });
    };
  
const showsh=async(bot,chatId,chid,codename,chname)=>{
  let amount="disabled"
  try{
    found=await prisma.UserChannel.findFirst({
      where: {
        channel_id: parseInt(chid),
        user_id:chatId.toString()
      },
    })
    if(found.amount!=0&& found.amount!=null&&found.amount){amount=found.amount}
   
  }catch(e){
    console.error(e)
  }
  verif=await isChannel(chatId.toString(),parseInt(chid))

  message= channelmessage(verif,codename,chname,amount)
  console.log(message)
  keyboard=trackkeyboard(chid,codename,chname);

  bot.sendMessage(chatId, message, {

        
    reply_markup: {
      inline_keyboard:keyboard ,
    },
  });
}
module.exports={showChannel,showsh}