import Observer from '../../common/utils/observer';
import TicksService from '../common/TicksService';
import api from '../view/deriv/api';

export const createScope = () => {
    const observer = new Observer();
    const ticksService = new TicksService(api);

    return { observer, api, ticksService };
};
