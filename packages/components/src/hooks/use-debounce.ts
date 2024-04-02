import React from 'react';
import debounce from 'lodash.debounce';

export const useDebounce = (callback: () => void, timeout: number) => {
    const debouncedCallback = React.useMemo(
        () => debounce(callback, timeout),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    React.useEffect(() => {
        return debouncedCallback.cancel;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return debouncedCallback;
};
