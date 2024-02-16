import { OSDetect, getPlatformFromUrl, mobileOSDetect } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TCFDsPlatformType, TMobilePlatforms } from 'Components/props.types';
import { CFD_PLATFORMS, MOBILE_PLATFORMS, DESKTOP_PLATFORMS, CATEGORY } from './cfd-config';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const platformsText = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case CFD_PLATFORMS.CTRADER:
            return 'cTrader';
        case CFD_PLATFORMS.DXTRADE:
            return 'X';
        default:
            return '';
    }
};

const platformsIcons = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case CFD_PLATFORMS.DXTRADE:
            return 'Dxtrade';
        case CFD_PLATFORMS.CTRADER:
            return 'Ctrader';
        default:
            return '';
    }
};

const getTitle = (market_type: string, is_eu_user: boolean) => {
    if (is_eu_user) localize('MT5 CFDs');
    return market_type;
};

const { is_staging, is_test_link } = getPlatformFromUrl();

const REAL_DXTRADE_URL = 'https://dx.deriv.com';
const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

const CTRADER_DESKTOP_DOWNLOAD = 'https://getctrader.com/deriv/ctrader-deriv-setup.exe';
const CTRADER_DOWNLOAD_LINK = 'https://ctrader.com/download/';

const CTRADER_UAT_URL = 'https://ct-uat.deriv.com/';
const CTRADER_PRODUCTION_URL = 'https://ct.deriv.com/';

const DXTRADE_IOS_APP_URL = 'https://apps.apple.com/us/app/deriv-x/id1563337503';
const DXTRADE_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.dx';
const DXTRADE_HUAWEI_APP_URL = 'https://appgallery.huawei.com/app/C104633219';

const CTRADER_IOS_APP_URL = 'https://apps.apple.com/cy/app/ctrader/id767428811';
const CTRADER_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.ct';

const CTRADER_URL = is_staging || is_test_link ? CTRADER_UAT_URL : CTRADER_PRODUCTION_URL;

const getTopUpConfig = () => {
    return {
        minimum_amount: 1000,
        additional_amount: 10000,
    };
};

const getPlatformDXTradeDownloadLink = (platform?: TMobilePlatforms) => {
    switch (platform) {
        case MOBILE_PLATFORMS.IOS:
            return DXTRADE_IOS_APP_URL;
        case MOBILE_PLATFORMS.HAUWEI:
            return DXTRADE_HUAWEI_APP_URL;
        case MOBILE_PLATFORMS.ANDROID:
            return DXTRADE_ANDROID_APP_URL;
        default:
            return '';
    }
};

const getPlatformCTraderDownloadLink = (platform: TMobilePlatforms) => {
    switch (platform) {
        case MOBILE_PLATFORMS.IOS:
            return CTRADER_IOS_APP_URL;
        case MOBILE_PLATFORMS.ANDROID:
            return CTRADER_ANDROID_APP_URL;
        case MOBILE_PLATFORMS.HAUWEI:
            return '';
        default:
            return CTRADER_ANDROID_APP_URL;
    }
};

const getPlatformMt5DownloadLink = (platform: string | undefined = undefined) => {
    switch (platform || OSDetect()) {
        case DESKTOP_PLATFORMS.LINUX:
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case DESKTOP_PLATFORMS.MACOS:
            return 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg';
        case MOBILE_PLATFORMS.HAUWEI:
            return 'https://appgallery.huawei.com/#/app/C102015329';
        default:
            return '';
    }
};

const getDXTradeWebTerminalLink = (category: string, token?: string) => {
    let url = category === CATEGORY.REAL ? REAL_DXTRADE_URL : DEMO_DXTRADE_URL;

    if (token) {
        url += `?token=${token}`;
    }

    return url;
};

const getCTraderWebTerminalLink = (category?: string, token?: string) => {
    return `${CTRADER_URL}${token && `?token=${token}`}`;
};

const getMobileAppInstallerURL = () => {
    if (mobileOSDetect() === 'iOS') {
        return getPlatformMt5DownloadLink('ios');
    } else if (/huawei/i.test(navigator.userAgent)) {
        return getPlatformMt5DownloadLink('huawei');
    }
    return getPlatformMt5DownloadLink('android');
};

const getDownloadOptions = ({ mt5_trade_account }: { mt5_trade_account: DetailsOfEachMT5Loginid }) => {
    const downloadOptions = [
        {
            icon: 'IcRebrandingMt5Logo',
            text: 'MetaTrader 5 web',
            button_text: 'Open',
            href: mt5_trade_account?.webtrader_url,
        },
        {
            icon: 'IcWindowsLogo',
            text: localize('MetaTrader 5 Windows app'),
            button_text: 'Download',
            href: mt5_trade_account?.white_label?.download_links?.windows,
        },
        {
            icon: 'IcMacosLogo',
            text: localize('MetaTrader 5 macOS app'),
            button_text: 'Download',
            href: getPlatformMt5DownloadLink('macos'),
        },
        {
            icon: 'IcLinuxLogo',
            text: localize('MetaTrader 5 Linux app'),
            button_text: 'Learn more',
            href: getPlatformMt5DownloadLink('linux'),
        },
    ];

    return downloadOptions;
};

export {
    REAL_DXTRADE_URL,
    DEMO_DXTRADE_URL,
    CTRADER_URL,
    CTRADER_DOWNLOAD_LINK,
    platformsText,
    getPlatformDXTradeDownloadLink,
    getPlatformCTraderDownloadLink,
    getPlatformMt5DownloadLink,
    CTRADER_DESKTOP_DOWNLOAD,
    getDXTradeWebTerminalLink,
    getCTraderWebTerminalLink,
    platformsIcons,
    getTitle,
    getTopUpConfig,
    getDownloadOptions,
    getMobileAppInstallerURL,
};
