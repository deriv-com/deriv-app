import * as React from 'react';
import { isDeepEqual } from '@deriv/shared';

// Note: Do not use this effect on huge objects or objects with
// circular references as performance may suffer.
export const useDeepEffect = (callback: () => void, dependencies: unknown[]) => {
    const prev_dependencies = React.useRef<unknown[] | null>(null);

    if (!isDeepEqual(prev_dependencies, dependencies)) {
        prev_dependencies.current = dependencies;
        callback();
    }
};
