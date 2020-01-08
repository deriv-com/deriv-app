import { observer as globalObserver } from '../../../utils/observer';

export const contract = c => globalObserver.emit('bot.contract', c);

export const contractStatus = c => globalObserver.emit('contract.status', c);

export const contractSettled = c => globalObserver.emit('contract.settled', c);

export const info = i => globalObserver.emit('bot.info', i);

// TODO use api time
export const notify = (className, message) => globalObserver.emit('ui.log.notify', { className, message });

export const log = (message) => globalObserver.emit('ui.log.success', { message });

export const error = (message) => globalObserver.emit('ui.log.success', { message });
