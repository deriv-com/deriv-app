import { localize } from 'deriv-translations';

export const getMtCompanies = () => {
    const standard_config   = {
        account_type: 'standard',
        leverage    : 1000,
        short_title : localize('Standard'),
    };
    const advanced_config   = {
        account_type: 'advanced',
        leverage    : 100,
        short_title : localize('Advanced'),
    };
    const volatility_config = {
        account_type: '',
        leverage    : 500,
        short_title : localize('Synthetic Indices'),
    };

    return ({
        demo: {
            standard: {
                mt5_account_type: standard_config.account_type,
                leverage        : standard_config.leverage,
                title           : localize('Demo Standard'),
                short_title     : standard_config.short_title,
            },
            advanced: {
                mt5_account_type: advanced_config.account_type,
                leverage        : advanced_config.leverage,
                title           : localize('Demo Advanced'),
                short_title     : advanced_config.short_title,
            },
            synthetic_indices: {
                mt5_account_type: volatility_config.account_type,
                leverage        : volatility_config.leverage,
                title           : localize('Demo Synthetic Indices'),
                short_title     : volatility_config.short_title,
            },
        },
        real: {
            standard: {
                mt5_account_type: standard_config.account_type,
                leverage        : standard_config.leverage,
                title           : localize('Real Standard'),
                short_title     : standard_config.short_title,
            },
            advanced: {
                mt5_account_type: advanced_config.account_type,
                leverage        : advanced_config.leverage,
                title           : localize('Real Advanced'),
                short_title     : advanced_config.short_title,
            },
            synthetic_indices: {
                mt5_account_type: volatility_config.account_type,
                leverage        : volatility_config.leverage,
                title           : localize('Real Synthetic Indices'),
                short_title     : volatility_config.short_title,
            },
        },
    });
};

export const getMt5GroupConfig = (group = undefined) => {
    const map_mode = {
        'real\\svg_standard': {
            type    : 'standard',
            category: 'real',
        },
        'real\\vanuatu_standard': {
            type    : 'standard',
            category: 'real',
        },
        'real\\labuan_advanced': {
            type    : 'advanced',
            category: 'real',
        },
        'real\\svg': {
            type    : 'synthetic_indices',
            category: 'real',
        },
        'demo\\labuan_advanced': {
            type    : 'advanced',
            category: 'demo',
        },
        'demo\\svg': {
            type    : 'synthetic_indices',
            category: 'demo',
        },
        'demo\\svg_standard': {
            type    : 'standard',
            category: 'demo',
        },
        'demo\\vanuatu_standard': {
            type    : 'standard',
            category: 'demo',
        },
    };

    if (group !== undefined) {
        if (map_mode[group] && map_mode[group].type) {
            return map_mode[group];
        }

        return { type: '', category: '' };
    }

    return map_mode;
};

/**
 * Generate the enum for API request.
 *
 * @param {string} category [real, demo]
 * @param {string} type [standard, advanced, synthetic_indices]
 * @return {string}
 */
export const getAccountTypeFields = ({ category, type }) => {
    const map_mode = {
        real: {
            standard: {
                account_type    : 'financial',
                mt5_account_type: 'standard',
            },
            advanced: {
                account_type    : 'financial',
                mt5_account_type: 'advanced',
            },
            synthetic_indices: {
                account_type: 'gaming',
            },
        },
        demo: {
            standard: {
                account_type    : 'demo',
                mt5_account_type: 'standard',
            },
            advanced: {
                account_type    : 'demo',
                mt5_account_type: 'advanced',
            },
            synthetic_indices: {
                account_type: 'demo',
            },
        },
    };

    return map_mode[category][type];
};
