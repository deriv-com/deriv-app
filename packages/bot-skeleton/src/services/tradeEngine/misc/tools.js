import { Services } from '../state';

export const notify = args => Services.observer.emit('ui.log.notify', args);

export const miscAlert = (...args) => alert(...args);

export const miscConsole = ({ type, message }) => console[type](message); // eslint-disable-line no-console

export const miscPrompt = (...args) => prompt(...args);
