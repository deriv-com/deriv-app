import { CFD_PLATFORMS } from '@deriv/shared';
import { localize } from '@deriv/translations';

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
            return localize('Trade CFDs on forex, stocks & stock indices, commodities, and crypto.');
        }
        return '';
    },
};
