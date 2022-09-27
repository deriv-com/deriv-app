/*
    Responses that should be ignored upon receiving errors.
    We still log them, but having an error inside of these
    will not break the queue and send them to trackjs.
    This will look for predefined `ignored_responses_in_trackjs` from GTM, if
    there is none, then it just does not filter out any response.
*/

const getIgnoredResponseKeywords = () => {
    return window.ignored_responses_in_trackjs || [];
};

class ResponseQueue {
    constructor() {
        this.list = [];
        this.size = 3;
    }

    add(response) {
        this.list.unshift(response);
    }

    remove() {
        this.list.pop();
    }

    push(response) {
        if (this.list.length >= this.size) {
            this.remove();
        }
        this.add(response);
    }

    fresh() {
        this.list = [];
    }
}

const queue = new ResponseQueue();

/**
 * Listen on method calls and inspect the response to see if error is thrown.
 * Handling the response status is NOT this function's responsibility
 */
export const ApiCallProxyHandler = {
    get(target, prop_key, receiver) {
        try {
            const target_value = Reflect.get(target, prop_key, receiver);
            if (typeof target_value === 'function') {
                return function (...args) {
                    const result = target_value.apply(this, args);
                    if (result instanceof Promise) {
                        return new Promise(resolve => {
                            result
                                .then(response => {
                                    if (response.error) {
                                        queue.push(response);
                                        if (window.TrackJS) window.TrackJS.console.log(queue.list);
                                        queue.fresh();
                                        if (
                                            window.TrackJS &&
                                            !getIgnoredResponseKeywords().some(item => item === response.error.code)
                                        ) {
                                            window.TrackJS.track(response.error.code);
                                        }
                                    }
                                    queue.push(response);
                                    resolve(response);
                                })
                                .catch(error => {
                                    if (window.TrackJS) {
                                        window.TrackJS.console.log(queue.list);
                                        window.TrackJS.track(error.getMessage());
                                    }
                                });
                        });
                    }
                    return result;
                }.bind(this);
            }
            return target_value;
        } catch (error) {
            throw new Error(error.getMessage());
        }
    },
};

export const trackJSNetworkMonitor = obj => new Proxy(obj, ApiCallProxyHandler);
