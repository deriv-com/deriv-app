import { localize } from '@deriv/translations';

export type TDxCompanies = ReturnType<typeof getDxCompanies>;
export type TMtCompanies = ReturnType<typeof getMtCompanies>;

export const getDxCompanies = () => {
    const synthetic_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('Synthetic') as string,
    };
    const financial_config = {
        account_type: 'financial',
        leverage: 1000,
        short_title: localize('Financial') as string,
    };
    return {
        demo: {
            synthetic: {
                dxtrade_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Synthetic') as string,
                short_title: synthetic_config.short_title,
            },
            financial: {
                dxtrade_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: localize('Demo Financial') as string,
                short_title: financial_config.short_title,
            },
        },
        real: {
            synthetic: {
                dxtrade_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Synthetic') as string,
                short_title: synthetic_config.short_title,
            },
            financial: {
                dxtrade_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: localize('Financial') as string,
                short_title: financial_config.short_title,
            },
        },
    };
};

export const getMtCompanies = (is_eu: boolean) => {
    const synthetic_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('Synthetic') as string,
    };
    const financial_config = {
        account_type: 'financial',
        leverage: 1000,
        short_title: is_eu ? (localize('CFDs') as string) : (localize('Financial') as string),
    };
    const financial_stp_config = {
        account_type: 'financial_stp',
        leverage: 100,
        short_title: localize('Financial STP') as string,
    };

    return {
        demo: {
            synthetic: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Synthetic') as string,
                short_title: synthetic_config.short_title,
            },
            financial: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? (localize('Demo CFDs') as string) : (localize('Demo Financial') as string),
                short_title: financial_config.short_title,
            },
            financial_stp: {
                mt5_account_type: financial_stp_config.account_type,
                leverage: financial_stp_config.leverage,
                title: localize('Demo Financial STP') as string,
                short_title: financial_stp_config.short_title,
            },
        },
        real: {
            synthetic: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Synthetic') as string,
                short_title: synthetic_config.short_title,
            },
            financial: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? (localize('CFDs') as string) : (localize('Financial') as string),
                short_title: financial_config.short_title,
            },
            financial_stp: {
                mt5_account_type: financial_stp_config.account_type,
                leverage: financial_stp_config.leverage,
                title: localize('Financial STP') as string,
                short_title: financial_stp_config.short_title,
            },
        },
    };
};
