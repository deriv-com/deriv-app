import { observer as globalObserver } from '../../../utils/observer';

export const notify = args => globalObserver.emit('ui.log.notify', args);

export const miscAlert = (...args) => alert(...args);

export const miscConsole = ({ type, message }) => console[type](message); // eslint-disable-line no-console

export const miscPrompt = (...args) => prompt(...args);
