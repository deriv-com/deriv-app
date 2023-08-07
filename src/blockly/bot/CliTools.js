import Observer from '@utilities/observer';
import TicksService from '../../botPage/common/TicksService';

export const createScope = () => ({
    observer: new Observer(),
    ticksService: new TicksService(),
});
