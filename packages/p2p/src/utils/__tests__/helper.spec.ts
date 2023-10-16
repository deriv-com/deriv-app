import { checkRoutingHistory, getHistoryState } from 'Utils/helper';

const mock_app_routing_history = [
    {
        action: 'PUSH',
        key: '',
        hash: '',
        pathname: '/home',
        search: '',
        state: {
            page: 'home',
        },
    },
    {
        action: 'PUSH',
        key: '',
        hash: '',
        pathname: '/login',
        search: '',
        state: {
            page: 'login',
        },
    },
];

describe('checkRoutingHistory', () => {
    it('should return true if the routing history matches the page route', () => {
        const page_route = '/login';
        expect(checkRoutingHistory(mock_app_routing_history, page_route)).toBe(true);
    });
    it('should return false if the routing history does not match the page route', () => {
        const page_route = '/about';
        expect(checkRoutingHistory(mock_app_routing_history, page_route)).toBe(false);
    });
});

describe('getHistoryState', () => {
    it('should return the state of the history item of the given index', () => {
        const index = 1;
        expect(getHistoryState(mock_app_routing_history, index)).toEqual({
            page: 'login',
        });
    });
    it('should return empty object if the index is out of range', () => {
        const index = 3;
        expect(getHistoryState(mock_app_routing_history, index)).toEqual({});
    });
});
