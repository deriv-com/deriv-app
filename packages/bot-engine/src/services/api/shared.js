import _Symbol                     from './symbolApi';
import { generateLiveApiInstance } from './appId';
import TicksService                from './ticksService';
import Observer                    from '../../utils/observer';

export const symbolApi = new _Symbol(generateLiveApiInstance());

export const ticksService = new TicksService(generateLiveApiInstance());

export const createScope = () => {
    const api = generateLiveApiInstance();
    const observer = new Observer();

    return { observer, api, ticksService, symbolApi };
};
