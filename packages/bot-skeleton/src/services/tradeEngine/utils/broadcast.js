import { config } from '../../../constants/config';
import { Services } from '../state';

export const contract = c => Services.observer.emit('bot.contract', c);

export const contractStatus = c => Services.observer.emit('contract.status', c);

export const error = message => Services.observer.emit('ui.log.error', message);

export const info = i => Services.observer.emit('bot.info', i);

export const log = (log_type, extra) => Services.observer.emit('ui.log.success', { log_type, extra });

export const notify = (className, message) =>
    Services.observer.emit('ui.log.notify', { className, message, sound: config.lists.NOTIFICATION_SOUND[0][1] });
