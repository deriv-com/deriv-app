import Observer from '../../common/utils/observer';
import TicksService from '../common/TicksService';

export const createScope = () => ({
    observer: new Observer(),
    ticksService: new TicksService(),
});
