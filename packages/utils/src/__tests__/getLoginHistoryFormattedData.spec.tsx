import getLoginHistoryFormattedData from '../getLoginHistoryFormattedData';

describe('getLoginHistoryFormattedData', () => {
    type TStatus = 0 | 1;
    const mock_status: TStatus[] = [0, 1];
    const mock_login_history = [
        {
            action: 'login',
            environment:
                '10-Oct-23 13:02:23GMT IP=MOCK.IP.ADDRESS IP_COUNTRY=AE User_AGENT=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 LANG=EN',
            status: mock_status[0],
            time: 1696942944,
        },
    ];

    it('should return all the expected key value pairs', () => {
        const result = getLoginHistoryFormattedData(mock_login_history);
        const required_keys = ['date', 'action', 'browser', 'ip', 'status', 'id'];

        expect(required_keys.toString()).toBe(Object.keys(result[0]).toString());
    });

    it('should generate login history object with required information', () => {
        const result_object = getLoginHistoryFormattedData(mock_login_history)[0];

        expect(result_object.id).toEqual(0);
        expect(result_object.date).toEqual('2023-10-10 13:02:23 GMT');
        expect(result_object.action).toEqual('Login');
        expect(result_object.browser).toEqual('Chrome  v117.0.0.0');
        expect(result_object.ip).toEqual('MOCK.IP.ADDRESS');
        expect(result_object.status).toEqual('Failed');
    });
});
