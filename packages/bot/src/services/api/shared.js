import _Symbol                     from 'Api/symbolApi';
import { generateLiveApiInstance } from 'Api/appId';
import TicksService                from 'Api/ticksService';
import Observer                    from 'Utils/observer';

export const symbolApi = new _Symbol(generateLiveApiInstance());

export const ticksService = new TicksService(generateLiveApiInstance());

export const createScope = () => {
    const api = generateLiveApiInstance();
    const observer = new Observer();

    return { observer, api, ticksService, symbolApi };
};
