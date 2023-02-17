/*
    Responses that should be ignored upon receiving errors.
    We still log them, but having an error inside of these
    will not break the queue and send them to trackjs.
    This will look for predefined `ignored_responses_in_trackjs` from GTM, if
    there is none, then it just does not filter out any response.
*/
declare global {
    interface Window {
        ignored_responses_in_trackjs: [];
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
    }
}

const getIgnoredResponseKeywords = () => {
    return window.ignored_responses_in_trackjs || [];
};

class ResponseQueue {
    list: unknown[];
    size: number;
    constructor() {
        this.list = [];
        this.size = 3;
    }

    add(response: unknown) {
        this.list.unshift(response);
    }

    remove() {
        this.list.pop();
    }

    push(response: unknown) {
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
    get(target: object, prop_key: PropertyKey, receiver: string) {
        try {
            const target_value = Reflect.get(target, prop_key, receiver);
            if (typeof target_value === 'function') {
                return (...args: string[]) => {
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
                                            !getIgnoredResponseKeywords().some(
                                                (item: string) => item === response.error.code
                                            )
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
                };
            }
            return target_value;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
        return null;
    },
};

export const trackJSNetworkMonitor = (obj: Record<string, unknown>) => new Proxy(obj, ApiCallProxyHandler);
