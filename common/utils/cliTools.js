import TicksService                from './ticksService';
import { generateLiveApiInstance } from '../appId';
import Interpreter                 from '../interpreter';
import Observer                    from '../observer';

export const createScope = () => {
    const observer = new Observer();
    const api = generateLiveApiInstance();

    const ticksService = new TicksService(api);

    return { observer, api, ticksService };
};

export const createInterpreter = () => new Interpreter();
