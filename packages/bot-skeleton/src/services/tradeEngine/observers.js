import { observer as globalObserver } from '../../utils/observer';

// [Todo] Move all observer here
export const isTradeAgainObserver = result => globalObserver.emit('bot.trade_again', result);
