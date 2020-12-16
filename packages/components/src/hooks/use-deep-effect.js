import * as React from 'react';
import { isDeepEqual } from '@deriv/shared';

export const useDeepEffect = (callback, dependencies) => {
    const prev_dependencies = React.useRef(null);

    if (!isDeepEqual(prev_dependencies, dependencies)) {
        prev_dependencies.current = dependencies;
        callback();
    }
};
