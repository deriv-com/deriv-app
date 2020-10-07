import { observer as globalObserver } from '../../../utils/observer';
import { config } from '../../../constants/config';

export const contract = c => globalObserver.emit('bot.contract', c);

export const contractStatus = c => globalObserver.emit('contract.status', c);

export const info = i => globalObserver.emit('bot.info', i);

export const notify = (className, message) =>
    globalObserver.emit('ui.log.notify', { className, message, sound: config.lists.NOTIFICATION_SOUND[0][1] });

export const log = (log_type, extra) => globalObserver.emit('ui.log.success', { log_type, extra });

export const error = message => globalObserver.emit('ui.log.error', message);
