import React from 'react';
import Loadable from 'react-loadable';

export type TFunction = () => any;

export const makeLazyLoader = (importFn: TFunction, loaderFn: TFunction) => (component_name?: string) =>
    Loadable.Map({
        loader: {
            ComponentModule: importFn,
        },
        render(loaded: { [key: string]: any }, props: object) {
            const ComponentLazy = component_name
                ? loaded.ComponentModule.default[component_name]
                : loaded.ComponentModule.default;
            return <ComponentLazy {...props} />;
        },
        loading: loaderFn,
    });
