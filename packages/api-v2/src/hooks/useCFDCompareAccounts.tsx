import { useMemo } from 'react';

import useLandingCompany from './useLandingCompany';
import useSortedMT5Accounts from './useSortedMT5Accounts';

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
const useCFDCompareAccounts = (isEU?: boolean) => {
    const { data: sortedMt5Accounts, ...rest } = useSortedMT5Accounts(isEU ? 'EU' : undefined);
    const { data: landingCompany } = useLandingCompany();

    const hasDxtradeAccountAvailable = landingCompany?.dxtrade_all_company;
    const hasCTraderAccountAvailable = landingCompany?.ctrader?.all?.standard === JURISDICTION.SVG;

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
