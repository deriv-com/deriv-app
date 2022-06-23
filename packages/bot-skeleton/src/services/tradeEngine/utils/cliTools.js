import TicksService from '../../api/ticks_service';
import Observer from '../../../utils/observer';
import ws from '../../api/ws';

export const createScope = () => {
    const observer = new Observer();
    const api = ws;
    const ticksService = new TicksService(api);
    const stopped = false;
    return { observer, api, ticksService, stopped };
};
