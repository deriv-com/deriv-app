import getToolsInterface from './ToolsInterface';
import getTicksInterface from './TicksInterface';
import getBotInterface from './BotInterface';

export const getInterface = () => {
    return {
        ...getBotInterface(),
        ...getToolsInterface(),
        getTicksInterface: getTicksInterface(),
    };
};
