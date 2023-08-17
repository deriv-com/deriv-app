/* eslint-disable */

const checked_subs = new Set();
const requests = new Map();

class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.debounced_calls = {};
    }

    sendWillBeCalled({ args: [request] }) {
        this.config.wsEvent('send');

        const key = requestToKey(request);

        if (key in this.debounced_calls) {
            return this.debounced_calls[key];
        }

        return undefined;
    }

    requestDataTransformer(args) {
        const keys = Object.keys(args.parsed_request)[0];
        let key = keys;
        if (args?.is_subscription) {
            if (!checked_subs.has(key)) {
                checked_subs.add(`${key}:${args.req_id}`);
                key = `${key}:${args.req_id}`;
            }
        }
        requests.set(key, new Date(Date.now()).toISOString());
        console.time(args.req_id);

        return args.parsed_request;
    }

    onSubscriptionResponse({ response }) {
        if (response?.subscription && checked_subs.has(`${response.msg_type}:${response.req_id}`)) {
            console.log(
                `${response.msg_type}(subscribed) ${requests.get(`${response.msg_type}:${response.req_id}`)} ${new Date(
                    Date.now()
                ).toISOString()}`
            );
            console.timeEnd(response.req_id);
            checked_subs.delete(`${response.msg_type}:${response.req_id}`);
        }
    }

    sendIsCalled({ response_promise, args: [request, options = {}] }) {
        options.callback = res => {
            console.log(`${res.msg_type} ${requests.get(res.msg_type)} ${new Date(Date.now()).toISOString()}`);
            console.timeEnd(request.req_id);
        };
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
