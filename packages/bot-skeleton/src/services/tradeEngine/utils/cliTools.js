import ws from '../../api/ws';

export const createScope = () => {
    const api = ws;
    const stopped = false;
    const session = {
        runs: 0,
        profit: 0,
    };
    const balance = 0;
    return { api, stopped, session, balance };
};

const $scope = createScope();

export default $scope;
