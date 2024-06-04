import { Jurisdiction } from '@deriv/shared';
import { localize } from '@deriv/translations';

export type TDxCompanies = ReturnType<typeof getDxCompanies>;
export type TMtCompanies = ReturnType<typeof getMtCompanies>;
export type TCTraderCompanies = ReturnType<typeof getCTraderCompanies>;

export const getDxCompanies = () => {
    const all_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('CFDs'),
    };
    const synthetic_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('Derived'),
    };
    const financial_config = {
        account_type: 'financial',
        leverage: 1000,
        short_title: localize('Financial'),
    };
    return {
        demo: {
            all: {
                dxtrade_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Demo'),
                short_title: all_config.short_title,
            },
            synthetic: {
                dxtrade_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Derived'),
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
            all: {
                dxtrade_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Real'),
                short_title: all_config.short_title,
            },
            dxtrade: {
                mt5_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Real'),
                short_title: all_config.short_title,
            },
            synthetic: {
                dxtrade_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Derived'),
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

export const getCTraderCompanies = () => {
    const all_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('All'),
    };
    return {
        demo: {
            all: {
                ctrader_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Demo'),
                short_title: all_config.short_title,
            },
        },
        real: {
            all: {
                dxtrade_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('All'),
                short_title: all_config.short_title,
            },
        },
    };
};

export const getMtCompanies = (is_eu: boolean) => {
    const all_config = {
        account_type: '',
        leverage: 100,
        short_title: localize('Swap-Free'),
    };
    const synthetic_config = {
        account_type: '',
        leverage: 500,
        short_title: localize('Derived'),
    };
    const financial_config = {
        account_type: 'financial',
        leverage: 1000,
        short_title: is_eu ? localize('Deriv CFDs') : localize('Financial'),
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
                title: localize('Demo Swap-Free'),
                short_title: all_config.short_title,
            },
            all_svg: {
                mt5_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Demo Swap-Free SVG'),
                short_title: localize('Swap-Free SVG'),
            },
            ctrader: {
                mt5_account_type: all_config.account_type,
                leverage: '500',
                title: localize('Demo'),
                short_title: localize('cTrader'),
            },
            synthetic: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Derived'),
                short_title: synthetic_config.short_title,
            },
            financial: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('Demo CFDs') : localize('Demo Financial'),
                short_title: financial_config.short_title,
            },
            financial_demo: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('Demo CFDs') : localize('Demo Financial'),
                short_title: financial_config.short_title,
            },
            synthetic_svg: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Demo Derived SVG'),
                short_title: synthetic_config.short_title,
            },

            financial_svg: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('Demo CFDs') : localize('Demo Financial SVG'),
                short_title: is_eu ? localize('CFDs') : localize('Financial SVG'),
            },
            financial_stp: {
                mt5_account_type: financial_stp_config.account_type,
                leverage: financial_stp_config.leverage,
                title: localize('Demo Financial STP'),
                short_title: financial_stp_config.short_title,
            },
        },
        real: {
            all: {
                mt5_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Swap-Free'),
                short_title: all_config.short_title,
            },
            all_svg: {
                mt5_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Swap-Free SVG'),
                short_title: all_config.short_title,
            },
            ctrader: {
                mt5_account_type: all_config.account_type,
                leverage: '500',
                title: localize('Real'),
                short_title: localize('cTrader'),
            },
            dxtrade: {
                mt5_account_type: all_config.account_type,
                leverage: all_config.leverage,
                title: localize('Real'),
                short_title: all_config.short_title,
            },
            synthetic: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Derived'),
                short_title: synthetic_config.short_title,
            },
            synthetic_svg: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Derived SVG'),
                short_title: synthetic_config.short_title,
            },
            synthetic_bvi: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Derived BVI'),
                short_title: synthetic_config.short_title,
            },
            synthetic_v: {
                mt5_account_type: synthetic_config.account_type,
                leverage: synthetic_config.leverage,
                title: localize('Derived Vanuatu'),
                short_title: synthetic_config.short_title,
            },
            financial: {
                mt5_account_type: financial_config.account_type,
                leverage: financial_config.leverage,
                title: is_eu ? localize('Deriv CFDs') : localize('Financial'),
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

export const getFormattedJurisdictionCode = (jurisdiction_code: string) => {
    let formatted_label = '';

    switch (jurisdiction_code) {
        case Jurisdiction.SVG:
            formatted_label = localize('SVG');
            break;
        case Jurisdiction.BVI:
            formatted_label = localize('BVI');
            break;
        case Jurisdiction.LABUAN:
            formatted_label = localize('Labuan');
            break;
        case Jurisdiction.VANUATU:
            formatted_label = localize('Vanuatu');
            break;
        case Jurisdiction.MALTA_INVEST:
            formatted_label = localize('Malta');
            break;
        default:
            formatted_label = jurisdiction_code?.toUpperCase();
            break;
    }

    return formatted_label;
};
