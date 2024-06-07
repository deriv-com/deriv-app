import React from 'react';
import Loadable from 'react-loadable';

export const makeLazyLoader =
    (importFn: () => Promise<unknown>, loaderFn: () => JSX.Element) => (componentName?: string) =>
        Loadable.Map({
            loader: {
                ComponentModule: importFn,
            },
            loading: loaderFn,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render(loaded: { [key: string]: any }, props: object) {
                const ComponentLazy = componentName
                    ? loaded.ComponentModule.default[componentName]
                    : loaded.ComponentModule.default;
                return <ComponentLazy {...props} />;
            },
        });

export const moduleLoader = (lazyComponent: () => Promise<unknown>, attempts = 3, interval = 1500) => {
    return new Promise((resolve, reject) => {
        lazyComponent()
            .then(resolve)
            .catch((error: unknown) => {
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
