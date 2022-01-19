import React from 'react';
import Loadable from 'react-loadable';

export const makeLazyLoader =
    ({ importFn, loaderFn, modulesFn, webpackFn }) =>
    component_name =>
        Loadable.Map({
            loader: {
                ComponentModule: importFn,
            },
            render(loaded, props) {
                const ComponentLazy = component_name
                    ? loaded.ComponentModule.default[component_name]
                    : loaded.ComponentModule.default;
                return <ComponentLazy {...props} />;
            },
            loading: loaderFn,
            modules: modulesFn,
            webpack: webpackFn,
        });
