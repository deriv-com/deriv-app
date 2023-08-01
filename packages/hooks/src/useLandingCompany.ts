import React from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

/** A custom hook to get the list of active symbols. */
const useLandingCompany = () => {
    const { client } = useStore();
    const { residence } = client;

    const { data, ...rest } = useFetch('landing_company', {
        payload: { landing_company: residence },
        // options: {
        //     refetchOnWindowFocus: false,
        // },
    });

    return {
        data: data?.landing_company || {},
        ...rest,
    };
};

export default useLandingCompany;

// we can move the following logics in the data transformation layer here in the hook

// get current_landing_company() {
//     const landing_company =
//         this.landing_companies &&
//         Object.keys(this.landing_companies).find(
//             company => this.landing_companies[company]?.shortcode === this.landing_company_shortcode
//         );
//     return landing_company ? this.landing_companies[landing_company] : undefined;
// }

// const is_bvi = landing_companies?.mt_financial_company?.financial_stp?.shortcode === 'bvi';
