import { api_base } from '@api-base';
import Observer from '../../common/utils/observer';
import TicksService from '../common/TicksService';

export const createScope = () => {
    const observer = new Observer();
    const ticksService = new TicksService(api_base.api);

    return {
        observer,
        api: api_base.api,
        ticksService,
    };
};
