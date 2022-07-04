import { Services } from './state';

// [Todo] Move all observer here
export const isTradeAgainObserver = result => Services.observer.emit('bot.trade_again', result);
