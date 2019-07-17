import Interpreter                 from './interpreter';
import TicksService                from '../../api/ticksService';
import { generateLiveApiInstance } from '../../api/appId';
import Observer                    from '../../../utils/observer';

export const createScope = () => {
    const observer = new Observer();
    const api = generateLiveApiInstance();

    const ticksService = new TicksService(api);

    return { observer, api, ticksService };
};

export const createInterpreter = () => new Interpreter();
