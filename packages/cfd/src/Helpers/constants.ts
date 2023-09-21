import { OSDetect } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TCFDsPlatformType, TMobilePlatforms } from 'Components/props.types';
import { CFD_PLATFORMS, MOBILE_PLATFORMS, OS_PLATFORMS, CATEGORY } from './cfd-config';

const platformsText = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case CFD_PLATFORMS.CTRADER:
            return 'cTrader';
        case CFD_PLATFORMS.DERIVEZ:
            return 'EZ';
        case CFD_PLATFORMS.DXTRADE:
            return 'X';
        default:
            return '';
    }
};

const platformsIcons = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case CFD_PLATFORMS.DERIVEZ:
            return 'DerivEz';
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

const REAL_DXTRADE_URL = 'https://dx.deriv.com';
const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

const CTRADER_DESKTOP_DOWNLOAD = 'https://getctrader.com/deriv/ctrader-deriv-setup.exe';

const CTRADER_DOWNLOAD_LINK = 'https://ctrader.com/download/';

const CTRADER_URL = 'https://ct.deriv.com/';

const DERIVEZ_URL = 'https://dqwsqxuu0r6t9.cloudfront.net/';
const DERIVEZ_IOS_APP_URL = 'https://apps.apple.com/my/app/deriv-go/id1550561298';
const DERIVEZ_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.app&pli=1';
const DERIVEZ_HUAWEI_APP_URL = 'https://appgallery.huawei.com/#/app/C103801913';

const DXTRADE_IOS_APP_URL = 'https://apps.apple.com/us/app/deriv-x/id1563337503';
const DXTRADE_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.dx';
const DXTRADE_HUAWEI_APP_URL = 'https://appgallery.huawei.com/app/C104633219';

const CTRADER_IOS_APP_URL = 'https://apps.apple.com/cy/app/ctrader/id767428811';
const CTRADER_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.spotware.ct&hl=en&gl=US';

const getBrokerName = () => 'Deriv Holdings (Guernsey) Limited';

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

const getPlatformDerivEZDownloadLink = (platform: TMobilePlatforms) => {
    switch (platform) {
        case MOBILE_PLATFORMS.IOS:
            return DERIVEZ_IOS_APP_URL;
        case MOBILE_PLATFORMS.ANDROID:
            return DERIVEZ_ANDROID_APP_URL;
        case MOBILE_PLATFORMS.HAUWEI:
            return DERIVEZ_HUAWEI_APP_URL;
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
        case OS_PLATFORMS.WINDOWS:
            return 'https://download.mql5.com/cdn/web/deriv.holdings.guernsey/mt5/deriv5setup.exe';
        case OS_PLATFORMS.LINUX:
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case MOBILE_PLATFORMS.IOS:
            return 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server,Deriv-Server-02';
        case OS_PLATFORMS.MACOS:
            return 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg';
        case MOBILE_PLATFORMS.HAUWEI:
            return 'https://appgallery.huawei.com/#/app/C102015329';
        case MOBILE_PLATFORMS.ANDROID:
            return 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server,Deriv-Server-02';
        default:
            return getMT5WebTerminalLink({ category: CATEGORY.REAL }); // Web
    }
};

const getDXTradeWebTerminalLink = (category: string, token?: string) => {
    let url = category === CATEGORY.REAL ? REAL_DXTRADE_URL : DEMO_DXTRADE_URL;

    if (token) {
        url += `?token=${token}`;
    }

    return url;
};

const getCTraderWebTerminalLink = (category: string, token?: string) => {
    return `${CTRADER_URL}${token && `?token=${token}`}`;
};

const getDerivEzWebTerminalLink = (category: string, token?: string) => {
    let url = DERIVEZ_URL;

    if (token) {
        url += `?lang=en&token=${token}`;
    }

    return url;
};

const getMT5WebTerminalLink = ({
    category,
    loginid,
    server_name = 'Deriv-Server',
}: {
    category?: string;
    loginid?: string;
    server_name?: string;
}) => {
    const is_demo = category === CATEGORY.DEMO;
    const server = is_demo ? 'Deriv-Demo' : server_name;
    const login = loginid ?? '';

    return `https://metatraderweb.app/trade?servers=${server}&trade_server=${server}${login && `&login=${login}`}`;
};

export {
    REAL_DXTRADE_URL,
    DEMO_DXTRADE_URL,
    CTRADER_URL,
    DERIVEZ_URL,
    CTRADER_DOWNLOAD_LINK,
    getBrokerName,
    platformsText,
    getPlatformDXTradeDownloadLink,
    getPlatformCTraderDownloadLink,
    getPlatformDerivEZDownloadLink,
    getPlatformMt5DownloadLink,
    CTRADER_DESKTOP_DOWNLOAD,
    getDXTradeWebTerminalLink,
    getCTraderWebTerminalLink,
    platformsIcons,
    getTitle,
    getDerivEzWebTerminalLink,
    getMT5WebTerminalLink,
    getTopUpConfig,
};
