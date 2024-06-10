import React from 'react';
import { getInitialLanguage } from '@deriv/translations';
import i18n from 'i18next';
import { initMoment } from '../date';
import { routes } from '../routes';
import { mobileOSDetect } from '../os';

type TPlatform = {
    icon_text?: string;
    is_hard_redirect: boolean;
    platform_name: string;
    route_to_path: string;
    url?: string;
};

type TPlatforms = Record<'p2p' | 'derivgo', TPlatform>;

// TODO: This should be moved to PlatformContext
export const platforms: TPlatforms = {
    p2p: {
        icon_text: undefined,
        is_hard_redirect: true,
        platform_name: 'Deriv P2P',
        route_to_path: routes.cashier_p2p,
        url: 'https://app.deriv.com/cashier/p2p',
    },
    derivgo: {
        icon_text: undefined,
        is_hard_redirect: true,
        platform_name: 'Deriv GO',
        route_to_path: '',
        url: 'https://app.deriv.com/redirect/derivgo',
    },
};

export const useOnLoadTranslation = () => {
    const [is_loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if (!i18n.language) {
            i18n.language = getInitialLanguage();
        }
        (async () => {
            await initMoment(i18n.language);
        })();
        const is_english = i18n.language === 'EN';
        if (is_english) {
            setLoaded(true);
        } else {
            i18n.store.on('added', () => {
                setLoaded(true);
            });
        }
        return () => i18n.store.off('added');
    }, []);

    return [is_loaded, setLoaded];
};

export const MOBILE_PLATFORMS = {
    IOS: 'ios',
    HAUWEI: 'huawei',
    ANDROID: 'android',
} as const;

type TMobilePlatforms = typeof MOBILE_PLATFORMS[keyof typeof MOBILE_PLATFORMS];

const DERIVGO_IOS_APP_URL = 'https://apps.apple.com/my/app/deriv-go-online-trading-app/id1550561298';
const DERIVGO_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.app';
const DERIVGO_HUAWEI_APP_URL = 'https://appgallery.huawei.com/app/C103801913';
export const DERIVGO_QRCODE_APP_URL = 'https://static.deriv.com/scripts/storeRedirect?app=deriv-go';
export const DERIVGO_OPEN_APP_URL = `${window.location.origin}/redirect/derivgo`;

export const getPlatformDerivGoDownloadLink = (platform: TMobilePlatforms) => {
    switch (platform) {
        case MOBILE_PLATFORMS.IOS:
            return DERIVGO_IOS_APP_URL;
        case MOBILE_PLATFORMS.HAUWEI:
            return DERIVGO_HUAWEI_APP_URL;
        case MOBILE_PLATFORMS.ANDROID:
            return DERIVGO_ANDROID_APP_URL;
        default:
            return '';
    }
};

export const getMobileDerivGoAppInstallerURL = () => {
    if (mobileOSDetect() === 'iOS') {
        return getPlatformDerivGoDownloadLink(MOBILE_PLATFORMS.IOS);
    } else if (mobileOSDetect() === 'huawei') {
        return getPlatformDerivGoDownloadLink(MOBILE_PLATFORMS.HAUWEI);
    } else if (mobileOSDetect() === 'Android') {
        return getPlatformDerivGoDownloadLink(MOBILE_PLATFORMS.ANDROID);
    }
    return '';
};
