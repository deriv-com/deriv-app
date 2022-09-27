import { localize } from '@deriv/translations';

export type TDxCompanies = ReturnType<typeof getDxCompanies>;
export type TMtCompanies = ReturnType<typeof getMtCompanies>;

export const getDxCompanies = () => {
    const synthetic_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('Synthetic'),
    };
    const financial_config = {
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
            },
            financial: {
                dxtrade_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: localize('Demo Financial'),
                short_title: financial_config.short_title,
            },
        },
        real: {
            synthetic: {
                dxtrade_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Synthetic'),
                short_title: synthetic_config.short_title,
            },
            financial: {
                dxtrade_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: localize('Financial'),
                short_title: financial_config.short_title,
            },
        },
    };
};

export const getMtCompanies = (is_eu: boolean) => {
    // TODO: Move this to the getDxCompanies for real release and when separating MT5 and DerivX components.
    const all_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('CFDs'),
    };
    const synthetic_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('Synthetic'),
    };
    const financial_config = {
        account_type: 'financial',
        leverage: 1000,
        short_title: is_eu ? localize('CFDs') : localize('Financial'),
    };
    const financial_stp_config = {
        account_type: 'financial_stp',
        leverage: 100,
        short_title: localize('Financial STP'),
    };

    return {
        demo: {
            all: {
                mt5_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Demo'),
                short_title: all_config.short_title,
            },
            synthetic: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Synthetic'),
                short_title: synthetic_config.short_title,
            },
            financial: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('Demo CFDs') : localize('Demo Financial'),
                short_title: financial_config.short_title,
            },
            synthetic_svg: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Synthetic SVG'),
                short_title: synthetic_config.short_title,
            },

            financial_svg: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('Demo CFDs') : localize('Demo Financial SVG'),
                short_title: financial_config.short_title,
            },
            financial_stp: {
                mt5_account_type: financial_stp_config.account_type,
                leverage: financial_stp_config.leverage,
                title: localize('Demo Financial STP'),
                short_title: financial_stp_config.short_title,
            },
        },
        real: {
            // TODO: Add All here before real release
            synthetic: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Synthetic'),
                short_title: synthetic_config.short_title,
            },
            synthetic_svg: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Synthetic SVG'),
                short_title: synthetic_config.short_title,
            },
            synthetic_bvi: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Synthetic BVI'),
                short_title: synthetic_config.short_title,
            },
            financial: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('CFDs') : localize('Financial'),
                short_title: financial_config.short_title,
            },
            financial_svg: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('CFDs') : localize('Financial SVG'),
                short_title: financial_config.short_title,
            },
            financial_bvi: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('CFDs') : localize('Financial BVI'),
                short_title: financial_config.short_title,
            },
            financial_fx: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('CFDs') : localize('Financial Labuan'),
                short_title: financial_config.short_title,
            },
            financial_v: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('CFDs') : localize('Financial Vanuatu'),
                short_title: financial_config.short_title,
            },
            financial_stp: {
                mt5_account_type: financial_stp_config.account_type,
                leverage: financial_stp_config.leverage,
                title: localize('Financial STP'),
                short_title: financial_stp_config.short_title,
            },
        },
    };
};
