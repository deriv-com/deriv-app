import { useFetch } from '@deriv/api';
import { useMemo } from 'react';

/** A custom hook to get the list of active symbols. */
const useActiveSymbols = () => {
    const { data, ...rest } = useFetch('active_symbols', {
        payload: { active_symbols: 'brief' },
        options: { refetchOnWindowFocus: true },
    });
    const active_symbols = useMemo(
        () =>
            data?.active_symbols?.map(symbol => ({
                ...symbol,
                /** The icon name for the underlying asset. */
                icon: `IcUnderlying${symbol.symbol}`,
            })),
        [data?.active_symbols]
    );

    return {
        /** List of active symbols. */
        data: active_symbols,
        ...rest,
    };
};

export default useActiveSymbols;
