/**
 * Listen on method calls and inspect the response to see if error is thrown.
 * Handling the response status is NOT this function's responsibility
 */
export const ApiCallProxyHandler = {
    get(target, prop_key, receiver) {
        try {
            const target_value = Reflect.get(target, prop_key, receiver);

            if (typeof target_value === 'function') {
                return function(...args) {
                    const result = target_value.apply(this, args);
                    if (result instanceof Promise) {
                        return new Promise((resolve) => {
                            let return_value;
                            result.then(response => {
                                if (response.error) {
                                    window.__response_error = response; // eslint-disable-line
                                }
                                return_value = response;
                            }).catch(error => {
                                window.__response_error = error; // eslint-disable-line
                            }).finally(() => {
                                resolve(return_value);
                            });
                        });
                    }
                    return result;
                }.bind(this);
            }
            return target_value;
        } catch (error) {
            window.__response_error = error; // eslint-disable-line
            throw new Error(error.getMessage());
        }
    },
};

export const trackJSNetworkMonitor = (obj) => new Proxy(obj, ApiCallProxyHandler);
