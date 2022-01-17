import { localize } from '@deriv/translations';

type TAccountTypeConfig = {
    account_type: string;
    leverage: number;
    short_title: string;
};

type TAccountDetails = {
    leverage: number;
    short_title: string;
    title: string;
};
type TDxAccountDetails = TAccountDetails & {
    dxtrade_account_type: string;
};
type TMtAccountDetails = TAccountDetails & {
    mt5_account_type: string;
};

export type TDxCompanies = ReturnType<typeof getDxCompanies>;
export type TMtCompanies = ReturnType<typeof getMtCompanies>;

export const getDxCompanies = () => {
    const synthetic_config: TAccountTypeConfig = {
        account_type: '',
        leverage: 500,
        short_title: localize('Synthetic'),
    };
    const financial_config: TAccountTypeConfig = {
        account_type: 'financial',
        leverage: 1000,
        short_title: localize('Financial'),
    };
    return {
        demo: {
            synthetic: {
                dxtrade_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Synthetic'),
                short_title: synthetic_config.short_title,
            } as TDxAccountDetails,
            financial: {
                dxtrade_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: localize('Demo Financial'),
                short_title: financial_config.short_title,
            } as TDxAccountDetails,
        },
        real: {
            synthetic: {
                dxtrade_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Synthetic'),
                short_title: synthetic_config.short_title,
            } as TDxAccountDetails,
            financial: {
                dxtrade_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: localize('Financial'),
                short_title: financial_config.short_title,
            } as TDxAccountDetails,
        },
    } as const;
};

export const getMtCompanies = (is_eu: boolean) => {
    const synthetic_config: TAccountTypeConfig = {
        account_type: '',
        leverage: 500,
        short_title: localize('Synthetic'),
    };
    const financial_config: TAccountTypeConfig = {
        account_type: 'financial',
        leverage: 1000,
        short_title: is_eu ? localize('CFDs') : localize('Financial'),
    };
    const financial_stp_config: TAccountTypeConfig = {
        account_type: 'financial_stp',
        leverage: 100,
        short_title: localize('Financial STP'),
    };

    return {
        demo: {
            synthetic: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Synthetic'),
                short_title: synthetic_config.short_title,
            } as TMtAccountDetails,
            financial: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('Demo CFDs') : localize('Demo Financial'),
                short_title: financial_config.short_title,
            } as TMtAccountDetails,
            financial_stp: {
                mt5_account_type: financial_stp_config.account_type,
                leverage: financial_stp_config.leverage,
                title: localize('Demo Financial STP'),
                short_title: financial_stp_config.short_title,
            } as TMtAccountDetails,
        },
        real: {
            synthetic: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Synthetic'),
                short_title: synthetic_config.short_title,
            } as TMtAccountDetails,
            financial: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('CFDs') : localize('Financial'),
                short_title: financial_config.short_title,
            } as TMtAccountDetails,
            financial_stp: {
                mt5_account_type: financial_stp_config.account_type,
                leverage: financial_stp_config.leverage,
                title: localize('Financial STP'),
                short_title: financial_stp_config.short_title,
            } as TMtAccountDetails,
        },
    } as const;
};
