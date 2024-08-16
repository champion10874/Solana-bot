
const selectionMessage=`Select call channels you'd like to subscribe to! 🔔`


const channelmessage=(
    verif,
    codename,
    chname,
    amount)=>
    {
    
    message=`${verif} tracking
    username: @${codename}
    name: __${chname}__
   
    📌 Auto Buy:
  
    Amount: ${amount}
  
  
  
  
    ℹ️ Please Enable autosell in you wallet and setup your selling strategy.
    ℹ️ Channel slippage settings will use your wallet settings.`
    return message
}
const autobuyAmount="↪️Reply with the autobuy amount (0) if you want to disable: "

const unableToTrack="Please track the channel to enable auto buy"

const autobuyMessage= (amount)=>{
    message = `autobuy amount set to ${amount}`
    return message
}

module.exports ={channelmessage,autobuyMessage,selectionMessage,autobuyAmount,unableToTrack}