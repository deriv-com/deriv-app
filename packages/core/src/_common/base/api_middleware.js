class APIMiddleware {
    data;

    constructor(config, data) {
        this.config = config;
        this.debounced_calls = {};
        this.data = data;
    }

    sendWillBeCalled({ args: [request] }) {
        this.config.wsEvent('send');

        const request_data = this.data ? { ...request, ...this.data } : request;

        const key = requestToKey(request_data);

        if (key in this.debounced_calls) {
            return this.debounced_calls[key];
        }

        return undefined;
    }

    sendIsCalled({ response_promise, args: [request, options = {}] }) {
        const promise = promiseRejectToResolve(response_promise);

        const key = requestToKey(request);

        if (options.callback) {
            promise.then(options.callback);
        }

        this.debounced_calls[key] = promise;

        promise.then(() => {
            delete this.debounced_calls[key];
        });

        return promise;
    }
}

// Delegate error handling to the callback
function promiseRejectToResolve(promise) {
    return new Promise(r => {
        promise.then(r, r);
    });
}

function requestToKey(request) {
    const request_copy = { ...request };

    delete request_copy.passthrough;
    delete request_copy.req_id;
    delete request_copy.subscribe;

    return JSON.stringify(request_copy);
}

module.exports = APIMiddleware;
