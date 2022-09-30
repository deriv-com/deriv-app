import TicksService from '../../api/ticks_service';
import Observer from '../../../utils/observer';
import { WS } from '@deriv/shared';

export const createScope = () => {
    const observer = new Observer();
    const api = WS.get();
    const ticksService = new TicksService(api);
    const stopped = false;
    return { observer, api, ticksService, stopped };
};
