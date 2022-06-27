import TicksService from '../../api/ticks_service';
import Observer from '../../../utils/observer';
import ws from '../../api/ws';

export const createScope = () => {
    const observer = new Observer();
    const api = ws;
    const ticksService = new TicksService(api);
    const stopped = false;
    const session = {
        runs: 0,
        profit: 0,
    };
    const balance = 0;
    return { observer, api, ticksService, stopped, session, balance };
};

const $scope = createScope();

export default $scope;
