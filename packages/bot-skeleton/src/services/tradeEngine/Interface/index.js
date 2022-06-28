import getToolsInterface from './ToolsInterface';
import getTicksInterface from './TicksInterface';
import getBotInterface from './BotInterface';
import { watch } from '../trade';
import { observer as globalObserver } from '../../../utils/observer';

const sleep = (arg = 1) => {
    return new Promise(
        r =>
            setTimeout(() => {
                r();
                setTimeout(() => globalObserver.emit('CONTINUE'), 0);
            }, arg * 1000),
        () => {}
    );
};

export const getInterface = () => {
    return {
        ...getBotInterface(),
        ...getToolsInterface(),
        getTicksInterface: getTicksInterface(),
        watch: (...args) => watch(...args),
        sleep: (...args) => sleep(...args),
        alert: (...args) => alert(...args), // eslint-disable-line no-alert
        prompt: (...args) => prompt(...args), // eslint-disable-line no-alert
        console: {
            log(...args) {
                // eslint-disable-next-line no-console
                console.log(new Date().toLocaleTimeString(), ...args);
            },
        },
    };
};
