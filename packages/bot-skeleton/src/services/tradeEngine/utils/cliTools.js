import TicksService from '../../api/ticks_service';
import Observer from '../../../utils/observer';
import api from '../../api/appId';

export const createScope = () => {
    const observer = new Observer();
    const ticksService = new TicksService(api);
    const stopped = false;
    return { observer, api, ticksService, stopped };
};
