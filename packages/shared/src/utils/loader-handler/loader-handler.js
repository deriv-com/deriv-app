export const moduleLoader = (lazyComponent, attempts = 2, interval = 1500) => {
    return new Promise((resolve, reject) => {
        lazyComponent()
            .then(resolve)
            .catch(error => {
                // let us retry after 1500 ms
                setTimeout(() => {
                    if (attempts === 1) {
                        reject(error);
                        return;
                    }
                    moduleLoader(lazyComponent, attempts - 1, interval).then(resolve, reject);
                }, interval);
            });
    });
};
