import send from '../request';  // Adjust the import path as needed

function mockWebSocketFactory() {
    let handlers: any = {};

    return jest.fn().mockImplementation(() => ({
        send: jest.fn(),
        close: jest.fn(),
        addEventListener: jest.fn((event, handler) => {
            handlers[event] = handler;
        }),
        removeEventListener: jest.fn(),
        respondFromServer: (data: any) => {
            handlers.message({ data });
        },
    }))();
}

describe('send function', () => {
    let mockWebSocket : any;

    beforeEach(() => {
        mockWebSocket = mockWebSocketFactory();
    });

    afterEach(() => {
        mockWebSocket = null;
    });

    test('should send request with correct req_id and name', async () => {
        const reqId = 1000;
        const name = 'test_action';

        const promise = send(mockWebSocket as unknown as WebSocket, reqId, name, {});
        mockWebSocket.respondFromServer(JSON.stringify({ req_id: reqId }));

        await promise;

        expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ [name]: 1, req_id: reqId }));
    });

    test('should send request with correct payload', async () => {
        const reqId = 1000;
        const name = 'test_action';
        const payload = { key: 'value' };

        const promise = send(mockWebSocket as unknown as WebSocket, reqId, name, payload);
        mockWebSocket.respondFromServer(JSON.stringify({ req_id: reqId }));

        await promise;

        expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ [name]: 1, ...payload, req_id: reqId }));
    });

    test('should yield the response from server', async () => {
        const reqId = 1000;
        const name = 'test_action';
        const mockData = { req_id: reqId, result: 'success' };

        const promise = send(mockWebSocket as unknown as WebSocket, reqId, name, {});

        mockWebSocket.respondFromServer(JSON.stringify(mockData));

        await expect(promise).resolves.toEqual(mockData);
    });

    test('should ignore responses from different reqSeqNumber', async () => {
        const reqId = 1000;
        const name = 'test_action';
        const wrongMockData = { req_id: 9999, result: 'wrong' };
        const correctMockData = { req_id: 1000, result: 'correct' };

        const promise = send(mockWebSocket as unknown as WebSocket, reqId, name, {});

        // sending multiple request of wrong data
        mockWebSocket.respondFromServer(JSON.stringify(wrongMockData));
        mockWebSocket.respondFromServer(JSON.stringify(wrongMockData));

        // then correct data
        mockWebSocket.respondFromServer(JSON.stringify(correctMockData));

        // then incorrect one again
        mockWebSocket.respondFromServer(JSON.stringify(wrongMockData));
        mockWebSocket.respondFromServer(JSON.stringify(wrongMockData));

        await expect(promise).resolves.toEqual(correctMockData);
    });

    test('should reject the promise in case of timeout', async () => {
        const reqId = 1000;
        const name = 'test_action';

        jest.useFakeTimers();

        const promise = send(mockWebSocket as unknown as WebSocket, reqId, name, {});

        jest.runAllTimers();

        await expect(promise).rejects.toMatch('Request timed out');
    });


    test('any addEventListener call should have a matching removeEventListener when server response is proper', async () => {
        const reqId = 1000;
        const name = 'test_action';

        const promise = send(mockWebSocket as unknown as WebSocket, reqId, name, {});
        mockWebSocket.respondFromServer(JSON.stringify({ req_id: reqId }));

        await promise;

        expect(mockWebSocket.addEventListener).toHaveBeenCalled();
        // removeEventListener should be called with the same handler addEventListener was called
        const onData = mockWebSocket.addEventListener.mock.calls[0][1];
        expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('message', onData);
    });

    test('any addEventListener call should have a matching removeEventListener in case of timeout', async () => {
        const reqId = 1000;
        const name = 'test_action';

        jest.useFakeTimers();

        const promise = send(mockWebSocket as unknown as WebSocket, reqId, name, {});

        jest.runAllTimers();

        await expect(promise).rejects.toMatch('Request timed out');

        expect(mockWebSocket.addEventListener).toHaveBeenCalled();
        // removeEventListener should be called with the same handler addEventListener was called
        const onData = mockWebSocket.addEventListener.mock.calls[0][1];
        expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('message', onData);
    });
});
