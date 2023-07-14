import { useFetch } from '@deriv/api';
import { useMemo } from 'react';

/** A custom hook to get the list of active symbols. */
const useLandingCompny = () => {

    const { data, ...rest } = useFetch('landing_company', {
        payload: { landing_company: 'brief' },
        options: { refetchOnWindowFocus: false },
    });
    // const landing_company = useMemo(
    //     () =>
    //         data?.landing_company?.map(symbol => ({
    //             ...symbol,
    //             /** The icon name for the underlying asset. */
    //             icon: `IcUnderlying${symbol.symbol}`,
    //         })),
    //     [data?.landing_company]
    // );

    // return {
    //     /** List of active symbols. */
    //     data: active_symbols,
    //     ...rest,
    // };
};

export default useLandingCompny;
