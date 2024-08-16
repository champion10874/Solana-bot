require('dotenv').config();
require('module-alias/register');

// require('@/seeds');

const bot = require('@/configs/bot');
const router = require('@/routes');
const store = require('@/store');
const { initStore } = require('@/store/utils');
const {autoSellToken}=require('@/events/token.event');
router(bot);
const stores=async () =>await initStore(store);
stores()

const mapping = async () => {
  try {
    await initStore(store);


    const json = store.getAllUsers();
    const userIds = Object.keys(json);
    
    userIds.forEach(num => autoSellToken(bot, num));
    
  } catch (error) {
    console.error("Error in mapping function:", error);
  }
};

// Execute the mapping operation every 7 seconds
setInterval(async () => {
  try {
    await mapping();
  } catch (error) {
    console.error("Error in setInterval:", error);
  }
}, 40000);

console.log("\n Sniper bot is running... \n");