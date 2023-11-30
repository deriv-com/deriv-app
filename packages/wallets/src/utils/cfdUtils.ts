import { TPlatforms } from '../types';

export const platformPasswordResetRedirectLink = (platform: TPlatforms.All, isVirtual?: boolean) => {
    switch (platform) {
        case 'mt5':
            return isVirtual ? 11 : 10;
        case 'dxtrade':
        default:
            return isVirtual ? 21 : 20;
    }
};

export const platformMapping: Record<string, Exclude<TPlatforms.All, 'ctrader'>> = {
    trading_platform_dxtrade_password_reset: 'dxtrade',
    trading_platform_mt5_password_reset: 'mt5',
};
