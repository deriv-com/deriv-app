import { useFetch } from '@deriv/api';

const useActiveSymbols = (mode?: 'brief' | 'full') => {
    const res = useFetch('active_symbols', {
        payload: {
            active_symbols: mode || 'brief',
        },
        options: {
            refetchOnWindowFocus: false,
        },
    });

    return res;
};

export default useActiveSymbols;
