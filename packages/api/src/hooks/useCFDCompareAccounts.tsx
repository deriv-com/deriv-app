import { useMemo } from 'react';
import useActiveWalletAccount from './useActiveWalletAccount';
import useAvailableMT5Accounts from './useAvailableMT5Accounts';
import useLandingCompany from './useLandingCompany';
import useMT5AccountsList from './useMT5AccountsList';

// Remove the hardcoded values and use the values from the API once it's ready
export const MARKET_TYPE = {
    ALL: 'all',
    FINANCIAL: 'financial',
    SYNTHETIC: 'synthetic',
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
    const { data: activeWallet } = useActiveWalletAccount();
    const { is_virtual: isDemo } = activeWallet || {};

    const { data: allAvailableMt5Accounts } = useAvailableMT5Accounts();
    const { data: addedAccounts, ...rest } = useMT5AccountsList();

    const modifiedMt5Data = useMemo(() => {
        if (!allAvailableMt5Accounts || !addedAccounts) return;

        return allAvailableMt5Accounts?.map(availableAccount => {
            const createdAccount = addedAccounts?.find(account => {
                return (
                    availableAccount.market_type === account.market_type &&
                    availableAccount.shortcode === account.landing_company_short
                );
            });
            if (createdAccount)
                return {
                    ...availableAccount,

                    /** Determine if the account is added or not */
                    is_added: true,
                } as const;

            return {
                ...availableAccount,

                /** Determine if the account is added or not */
                is_added: false,
            } as const;
        });
    }, [addedAccounts, allAvailableMt5Accounts]);

    // Sort the data by market_type to make sure the order is 'synthetic', 'financial', 'all'
    const sortedMt5Accounts = useMemo(() => {
        const marketTypeOrder = ['synthetic', 'financial', 'all'];

        if (!modifiedMt5Data) return;

        const sortedData = marketTypeOrder.reduce((acc, marketType) => {
            const accounts = modifiedMt5Data.filter(account => account.market_type === marketType);
            if (!accounts.length) return acc;
            return [...acc, ...accounts];
        }, [] as typeof modifiedMt5Data);

        return sortedData;
    }, [modifiedMt5Data]);

    const { data: landingCompany } = useLandingCompany();

    const hasDxtradeAccountAvailable = landingCompany?.dxtrade_all_company;
    const hasCTraderAccountAvailable = landingCompany?.ctrader?.all?.standard === JURISDICTION.SVG;

    const demoAvailableAccounts = useMemo(() => {
        if (!sortedMt5Accounts) return;
        return sortedMt5Accounts.filter(account => account.shortcode === JURISDICTION.SVG);
    }, [sortedMt5Accounts]);

    const modifiedData = useMemo(() => {
        return {
            ctraderAccount: hasCTraderAccountAvailable ? ctraderAccount : undefined,
            dxtradeAccount: hasDxtradeAccountAvailable ? dxtradeAccount : undefined,
            mt5Accounts: isDemo ? demoAvailableAccounts : sortedMt5Accounts,
        };
    }, [demoAvailableAccounts, hasCTraderAccountAvailable, hasDxtradeAccountAvailable, isDemo, sortedMt5Accounts]);

    return {
        data: modifiedData,
        hasCTraderAccountAvailable,
        hasDxtradeAccountAvailable,
        ...rest,
    };
};

export default useCFDCompareAccounts;
