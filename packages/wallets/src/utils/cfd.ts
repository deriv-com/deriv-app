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
