import TicksService from '../../api/ticks_service';
import Observer from '../../../utils/observer';
import { api_base } from '../../api/appId';

export const createScope = () => {
    const observer = new Observer();
    const ticksService = new TicksService(api_base.api);
    const stopped = false;
    return { observer, api: api_base, ticksService, stopped };
};
