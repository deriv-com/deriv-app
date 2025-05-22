import { useMemo } from 'react';

import useAvailableMT5Accounts from './useAvailableMT5Accounts';
import useLandingCompany from './useLandingCompany';

// Remove the hardcoded values and use the values from the API once it's ready
export const MARKET_TYPE = {
    ALL: 'all',
    FINANCIAL: 'financial',
    SYNTHETIC: 'synthetic',
} as const;

// Remove the hardcoded values and use the values from the API once it's ready
export const PRODUCT = {
    CTRADER: 'ctrader',
    DERIVX: 'derivx',
    SWAPFREE: 'swap_free',
    ZEROSPREAD: 'zero_spread',
} as const;

// Remove the hardcoded values and use the values from the API once it's ready
export const CFD_PLATFORMS = {
    CFDS: 'CFDs',
    CTRADER: 'ctrader',
    DXTRADE: 'dxtrade',
    MT5: 'mt5',
} as const;

// Remove the hardcoded values and use the values from the API once it's ready
export const JURISDICTION = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

// Remove the hardcoded values and use the values from the API once it's ready
const dxtradeAccount = {
    leverage: 0,
    market_type: MARKET_TYPE.ALL,
    name: 'Deriv X',
    platform: CFD_PLATFORMS.DXTRADE,
    requirements: {
        after_first_deposit: {
            financial_assessment: [''],
        },
        compliance: {
            mt5: [''],
            tax_information: [''],
        },
        signup: [''],
    },
    shortcode: JURISDICTION.SVG,
};

// Remove the hardcoded values and use the values from the API once it's ready
const ctraderAccount = {
    leverage: 0,
    market_type: MARKET_TYPE.ALL,
    name: 'cTrader',
    platform: CFD_PLATFORMS.CTRADER,
    requirements: {
        after_first_deposit: {
            financial_assessment: [''],
        },
        compliance: {
            mt5: [''],
            tax_information: [''],
        },
        signup: [''],
    },
    shortcode: JURISDICTION.SVG,
};

/** A custom hook that gets compare accounts values. */
const useCFDCompareAccounts = () => {
    const { data: all_available_mt5_accounts, ...rest } = useAvailableMT5Accounts();
    const { data: landingCompany } = useLandingCompany();

    const hasDxtradeAccountAvailable = landingCompany?.dxtrade_all_company;
    const hasCTraderAccountAvailable = landingCompany?.ctrader?.all?.standard === JURISDICTION.SVG;

    const sortedMt5Accounts = useMemo(() => {
        const sorting_order = ['standard', 'financial', 'stp', 'swap_free', 'zero_spread', 'gold'];

        if (!all_available_mt5_accounts) return;

        const sorted_data = sorting_order.reduce(
            (acc, sort_order) => {
                const accounts = all_available_mt5_accounts.filter(account => account.product === sort_order);
                if (!accounts.length) return acc;
                return [...acc, ...accounts];
            },
            [] as typeof all_available_mt5_accounts
        );

        return sorted_data;
    }, [all_available_mt5_accounts]);

    const modifiedData = useMemo(() => {
        return {
            ctraderAccount: hasCTraderAccountAvailable ? ctraderAccount : undefined,
            dxtradeAccount: hasDxtradeAccountAvailable ? dxtradeAccount : undefined,
            mt5Accounts: sortedMt5Accounts?.filter(
                //@ts-expect-error need update api-types
                account => account.is_default_jurisdiction === 'true'
            ),
        };
    }, [hasCTraderAccountAvailable, hasDxtradeAccountAvailable, sortedMt5Accounts]);

    return {
        data: modifiedData,
        hasCTraderAccountAvailable,
        hasDxtradeAccountAvailable,
        ...rest,
    };
};

export default useCFDCompareAccounts;
