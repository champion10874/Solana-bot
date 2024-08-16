const { trim } = require('@/utils');

const autoBuyMessage = ``;

const transactionInitiateMsg = (mode) => `
  ⏳ Initiating ${mode}...
`;

const transactionBuildFailedMsg = () => `
  ⛔ Building transaction failed, please try again.
`;
const transactionSentMsgauto = (txid) => `
🤖 Autobuy Transaction triggered. 
  https://solscan.io/tx/${txid}
`;
const transactionSentMsg = (txid) => `
  ➡ Transaction sent. Waiting for confirmation...
  https://solscan.io/tx/${txid}
`;

const transactionConfirmedMsg = (txid) => `
  ✅ Swap Successful
  https://solscan.io/tx/${txid}
`;

const transactionFailedMsg = (txid) => `
  📛 Swap failed
  https://solscan.io/tx/${txid}
`;

const wrapAutoBuy = (msg, mode, isAuto) => {
  if (mode === 'buy' && isAuto) {
    return `
      ${msg}
      🚨 <i>This trade was triggered with Auto Buy enabled. To enable confirmations or change the buy amount go to Settings (press /settings).</i>
    `;
  }
  if (mode === 'sell' && isAuto) {
    return `
      ${msg}
      🚨 <i>This trade was triggered with Auto Sell enabled. To enable confirmations or change the sell percent go to Settings (press /settings).</i>
    `;
  }
  return msg;
};

module.exports = {
  transactionInitiateMsg: ({ mode, isAuto }) =>
    trim(wrapAutoBuy(transactionInitiateMsg(mode), mode, isAuto)),

  transactionBuildFailedMsg: ({ mode, isAuto }) =>
    trim(wrapAutoBuy(transactionBuildFailedMsg(), mode, isAuto)),

  transactionSentMsg: ({ mode, isAuto, txid }) =>
    trim(wrapAutoBuy(transactionSentMsg(txid), mode, isAuto)),
  transactionSentMsgauto: ({ mode, isAuto, txid }) =>
    trim(wrapAutoBuy(transactionSentMsgauto(txid), mode, isAuto)),
  transactionConfirmedMsg: ({ mode, isAuto, txid }) =>
    trim(wrapAutoBuy(transactionConfirmedMsg(txid), mode, isAuto)),

  transactionFailedMsg: ({ mode, isAuto, txid }) =>
    trim(wrapAutoBuy(transactionFailedMsg(txid), mode, isAuto)),
};
