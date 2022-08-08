import React from 'react';
import { CFD_PLATFORMS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

export const general_messages = {
    getWelcomeHeader: (is_logged_in, platform) => {
        if (platform === CFD_PLATFORMS.DXTRADE) {
            if (is_logged_in) return localize('Welcome to your Deriv X dashboard');
            return localize('Welcome to Deriv X');
        } else if (platform === CFD_PLATFORMS.MT5) {
            return localize('Welcome to Deriv MT5 (DMT5) dashboard');
        }
        return localize('');
    },
    getDownloadHeader: platform => {
        if (platform === CFD_PLATFORMS.DXTRADE)
            return localize('Run Deriv X on your browser or download the mobile app');
        else if (platform === CFD_PLATFORMS.MT5)
            return localize('Run MT5 from your browser or download the MT5 app for your devices');
        return '';
    },
    getFinancialAccountDescriptor: (platform, is_eu) => {
        if (platform === CFD_PLATFORMS.DXTRADE) {
            return localize('Trade forex, basket indices, commodities, and cryptocurrencies with high leverage.');
        } else if (platform === CFD_PLATFORMS.MT5) {
            if (is_eu) {
                return localize(
                    'Trade CFDs on forex, stocks, stock indices, synthetic indices, and commodities with leverage.'
                );
            }
            return localize('Trade CFDs on forex, stocks & stock indices, commodities, basket indices, and crypto.');
        }
        return '';
    },

    getMT5LicenceNotes: (account_type, card_type) => {
        const account_type_name = account_type === 'synthetic' ? 'Synthetics' : 'Financial';
        switch (card_type) {
            case 'svg':
                return (
                    <Localize
                        i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (SVG) LLC (company no. 273 LLC 2020).'
                        values={{ account_type: account_type_name }}
                    />
                );
            case 'bvi':
                return (
                    <Localize
                        i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/{{line_break}}L/18/1114).'
                        values={{ account_type: account_type_name, line_break: '\n' }}
                    />
                );
            case 'vanuatu':
                return (
                    <Localize
                        i18n_default_text='Add Your DMT5 {{account_type}} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
                        values={{ account_type: account_type_name }}
                    />
                );
            case 'labuan':
                return (
                    <Localize
                        i18n_default_text='Add your DMT5 {{account_type}} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
                        values={{ account_type: account_type_name }}
                    />
                );
            case 'maltainvest':
                return (
                    <Localize
                        i18n_default_text='Add your DMT5 CFDs account under Deriv Investments (Europe) Limited regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).'
                        values={{ account_type: account_type_name }}
                    />
                );
            default:
                return null;
        }
    },
};
