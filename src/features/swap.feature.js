
const { VersionedTransaction } = require('@solana/web3.js');
const { Connection } = require('@solana/web3.js');

const { getQuote, getSwapTransaction } = require('@/services/jupiter');
const web3 = require('@solana/web3.js');
const {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
} = require("@solana/web3.js");
const signTransaction = (swapTransaction, payer) => {
  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  transaction.sign([payer]);
  return transaction;
};
const connection = new Connection('https://api.mainnet-beta.solana.com');
const executeTransaction = async (transaction) => {
  const rawTransaction = await transaction.serialize();
  const options = {
    skipPreflight: true,
    commitment: 'confirmed', // Adjust as needed
    preflightCommitment: 'processed',
  };
  const txid = await connection.sendRawTransaction( rawTransaction, options);

  return txid;
};

const initiateSwap = async ({ inputMint, outputMint, amount, payer }) => {
  // Specify the desired slippage tolerance (e.g., 1%)
  const slippage = 5000; // Adjust this value based on your requirements

  const quoteResponse = await getQuote({
    inputMint,
    outputMint,
    amount,
    slippage,
  });

  if (quoteResponse.error) {
    throw new Error(quoteResponse.error);
  }

  const { swapTransaction } = await getSwapTransaction({
    quoteResponse,
    payer,
  });

  return {
    quoteResponse,
    swapTransaction,
  };
};


const swapToken = async (swapTransaction, payer) => {
  const transaction = signTransaction(swapTransaction, payer);
  return executeTransaction(transaction);
};
module.exports = {
  initiateSwap,
  swapToken,
  
};
