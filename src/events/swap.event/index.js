const bs58 = require('bs58');
const { prisma } = require('@/configs/database');
const {
  Keypair
} = require('@solana/web3.js');
const {
  WalletNotFoundError
} = require('@/errors/common');
const {
  createTrade
} = require('@/controllers/trade.controller');
const {
  findWallet
} = require('@/controllers/wallet.controller');
const {
  showPositionAfterTrade
} = require('@/events/manage.event');
const {
  coverFee
} = require('@/features/fee.feature');
const {
  initiateSwap,
  swapToken
} = require('@/features/swap.feature');
const {
  confirmTransaction,
  getConfirmation
} = require('@/services/solana');
const {
  transactionInitiateMsg,
  transactionSentMsgauto,
  transactionBuildFailedMsg,
  transactionSentMsg,
  transactionConfirmedMsg,
  transactionFailedMsg,
} = require('./messages');

const swap = async (bot, msg, params,chatId,add) => {
  if (add==undefined){add={add:false,id:1}}
  
  if(msg!=0&&msg!=1){chatId=msg.chat.id;}
  else{chatId}
  
  const {
    inputMint,
    outputMint,
    amount,
    slippage,
    mode,
    isAuto
  } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const payer = Keypair.fromSecretKey(bs58.decode(wallet.secretKey));
  
  bot
    .sendMessage(chatId, await transactionInitiateMsg({
      mode,
      isAuto
    }), {
      parse_mode: 'HTML',
    })
    .then(async ({
      message_id
    }) => {
      let txid, quoteResponse;

      try {if(amount!=0){
        const res = await initiateSwap({
          inputMint,
          outputMint,
          amount: mode === 'buy' ? parseInt(amount * 0.99) : parseInt(amount),
          slippageBps: slippage,
          payer,
        });
        quoteResponse = res.quoteResponse;
        console.log(quoteResponse)
        txid = await swapToken(res.swapTransaction, payer);}
      } catch (e) {
        console.error(e);
        
        if(amount!=0&&msg!=0){
        bot.editMessageText(transactionBuildFailedMsg({
          mode,
          isAuto
        }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });}else{ bot.editMessageText("This token is not available for buyign now.", {
          chat_id: chatId,
          message_id,
          disable_web_page_preview: true,})}
      
        return;
      }
      if (msg==0){bot.editMessageText(await transactionSentMsgauto({
        mode,
        isAuto,
        txid
      }), {
        chat_id: chatId,
        message_id: message_id,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });}
      else{bot.editMessageText(await transactionSentMsg({
        mode,
        isAuto,
        txid
      }), {
        chat_id: chatId,
        message_id: message_id,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });}
      
      try {
        await confirmTransaction(txid);
        let confirmTx = await getConfirmation(txid);
       

        bot.editMessageText(await transactionConfirmedMsg({
          mode,
          isAuto,
          txid
        }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
        
        if (confirmTx) {
          showPositionAfterTrade(bot, msg, {
            mint: mode === 'buy' ? outputMint : inputMint,
            tradeAmount: mode === 'buy' ? quoteResponse.outAmount : -quoteResponse.inAmount,
          },chatId);

          trade =await createTrade({
            userId: chatId.toString(),
            inputMint: quoteResponse.inputMint,
            // inAmount: quoteResponse.inAmount,
            inAmount: amount,
            outputMint: quoteResponse.outputMint,
            outAmount: parseInt(
              quoteResponse.outAmount * (mode === 'buy' ? 1 : 0.99)
            ),
          });
        
          if(add.add==true){
           
            await prisma.strategyTrade.create({
              data: {
                strategyId: add.id,
                tradeId: trade.id,
              },
            })
          }
        }
        
        if (
          quoteResponse.inputMint ===
          'So11111111111111111111111111111111111111112'
        ) {
          coverFee(chatId, amount / 100);
        } else {
          coverFee(chatId, quoteResponse.outAmount / 100);
        }
      } catch (e) {
        console.error(e);
        if(amount!=0&&msg!=0){
        bot.editMessageText(transactionFailedMsg({
          mode,
          isAuto,
          txid
        }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
      }}
    });
};

module.exports = {
  swap,
};