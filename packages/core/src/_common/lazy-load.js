import React from 'react';
import Loadable from 'react-loadable';
import { Loading } from '@deriv/components';

const handleLoading = props => {
    // 200ms default
    if (props.pastDelay) {
        return <Loading />;
    }
    return null;
};

export const makeLazyLoader = importFn => component_name =>
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
        loading: handleLoading,
    });
