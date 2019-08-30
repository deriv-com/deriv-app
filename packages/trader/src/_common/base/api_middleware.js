class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.debounced_calls = {};
    }

    sendWillBeCalled({ args: [request] }) {
        this.config.wsEvent('send');

        const key = JSON.stringify(request);

        if (key in this.debounced_calls) {
            return this.debounced_calls[key];
        }

        return undefined;
    }

    sendIsCalled({ response_promise, args: [request, options = {}] }) {
        const promise = promiseRejectToResolve(response_promise);

        const key = JSON.stringify(request);

        if (options.callback) {
            promise.then(options.callback);
        }

        this.debounced_calls[key] = promise;

        promise.then(() => { delete this.debounced_calls[key]; });

        return promise;
    }
}

// Delegate error handling to the callback
function promiseRejectToResolve (promise) {
    return new Promise((r) => {
        promise.then(r, r);
    });
}

module.exports = APIMiddleware;
