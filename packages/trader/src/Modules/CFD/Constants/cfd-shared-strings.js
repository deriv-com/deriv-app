import { localize } from '@deriv/translations';

export const general_messages = {
    getWelcomeHeader: (is_logged_in, platform) => {
        if (platform === 'dxtrade') {
            if (is_logged_in) return localize('Welcome to your Deriv X dashboard');
            return localize('Welcome to Deriv X');
        } else if (platform === 'mt5') {
            if (is_logged_in) return localize('Welcome to your Deriv MT5 (DMT5) dashboard');
            return localize('Welcome to Deriv MT5 (DMT5) dashboard');
        }
        return localize('');
    },
    getDownloadHeader: platform => {
        if (platform === 'dxtrade') return localize('Run Deriv X on your browser or download the mobile app');
        else if (platform === 'mt5')
            return localize('Run MT5 from your browser or download the MT5 app for your devices');
        return '';
    },
};
