import { PlatformDetails } from '../features/cfd/constants';
import { TPlatforms } from '../types';

export const platformPasswordResetRedirectLink = (platform: TPlatforms.All, isVirtual?: boolean) => {
    switch (platform) {
        case PlatformDetails.mt5.platform:
            return isVirtual ? 11 : 10;
        case PlatformDetails.dxtrade.platform:
        default:
            return isVirtual ? 21 : 20;
    }
};
