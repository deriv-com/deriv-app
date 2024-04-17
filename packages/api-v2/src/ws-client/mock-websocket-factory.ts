
function mockWebSocketFactory() {
    interface Handlers {
        [key: string]: Array<Function>;
      }
      
    let handlers: Handlers = {};

    return jest.fn().mockImplementation(() => ({
        send: jest.fn(),
        close: jest.fn(() => {
            let closeHandlers = handlers['close'];
            if (closeHandlers) {
                closeHandlers.forEach(handler => handler());
            }
        }),
        addEventListener: jest.fn((event: string, handler: Function) => {
            if (!handlers[event]) {
                handlers[event] = [];
            }
            handlers[event].push(handler);
        }),
        removeEventListener: jest.fn((event: string, handler: Function) => {
            let eventHandlers = handlers[event];
            if (eventHandlers) {
                handlers[event] = eventHandlers.filter(h => h !== handler);
            }

            if (handlers[event].length === 0) {
                delete handlers[event];
            }
        }),
        respondFromServer: (response: string) => {
            let messageHandlers = handlers['message'];
            if (messageHandlers) {
                messageHandlers.forEach(handler => handler({ data: response }));
            }
        },
    }))();
}

export default mockWebSocketFactory;