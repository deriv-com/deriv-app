import React from 'react';
import Loadable from 'react-loadable';

export const makeLazyLoader =
    (importFn: () => Promise<unknown>, loaderFn: () => JSX.Element) => (componentName?: string) =>
        Loadable.Map({
            loader: {
                ComponentModule: importFn,
            },
            render(loaded: { [key: string]: any }, props: object) {
                const ComponentLazy = componentName
                    ? loaded.ComponentModule.default[componentName]
                    : loaded.ComponentModule.default;
                return <ComponentLazy {...props} />;
            },
            loading: loaderFn,
        });
