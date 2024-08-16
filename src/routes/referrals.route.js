const { showReferrals } = require('@/events/referrals.event');
const { showChannel ,showsh} = require('@/events/copyT.event');
const { track,autobuy } = require('@/events/copyT.event/verifier');
const referralsRouter = (bot) => {
  bot.onText(/^\/referrals$/, (msg) => {
    if (msg.chat.id) {
      showReferrals(bot, msg);
    }
  });

  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'showReferrals':
        showReferrals(bot, query.message);
        break;
        
          case 'copyT':
            showChannel(bot, query.message.chat.id);
            break;
            case 'track':
              const resultString1 = data.slice(3).join(' ');
              track(bot, query.message.chat.id,data[1],data[2],resultString1);
              break;
              case 'show':
                const resultString = data.slice(3).join(' ');
                showsh(bot,query.message.chat.id,data[1],data[2],resultString);
                break;
                case 'autobuy':
                  autobuy(bot,query.message.chat.id,data[1]);
                  break;
      default:
    }

  });
};

module.exports = referralsRouter;
