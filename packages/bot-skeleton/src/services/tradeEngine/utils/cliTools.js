import TicksService from '../../api/ticks_service';
import Observer from '../../../utils/observer';
import { generateDerivApiInstance } from '../../api/appId';

export const createScope = () => {
    const observer = new Observer();
    const api = generateDerivApiInstance();
    const ticksService = new TicksService(api);

    return { observer, api, ticksService };
};
