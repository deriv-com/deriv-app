export const makeCancellablePromise = (listener: Promise<unknown>) => {
    let done = false;
    let cancel: () => boolean | void = () => (done = true);
    const promise = new Promise((resolve, reject) => {
        cancel = () => {
            // If it is already done, don't do anything.
            if (!done) {
                done = true;
                reject(new Error('Cancelled'));
            }
        };
        listener
            .then(result => {
                if (done) {
                    // Promise is canceled or done.
                    reject(result);
                }
                done = true;
                resolve(result);
            })
            .catch((error: Error) => {
                done = true;
                reject(error);
            });
    });
    return { promise, cancel };
};
