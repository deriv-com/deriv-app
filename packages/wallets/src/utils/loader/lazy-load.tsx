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
