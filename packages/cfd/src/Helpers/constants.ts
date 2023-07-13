import { OSDetect } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TCFDsPlatformType } from 'Components/props.types';

const platformsText = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case 'derivez':
            return 'EZ';
        case 'dxtrade':
            return 'X';
        default:
            return '';
    }
};

const platformsIcons = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case 'derivez':
            return 'DerivEz';
        case 'dxtrade':
            return 'Dxtrade';
        default:
            return '';
    }
};

const mobileDownloadLink = (platform: TCFDsPlatformType, type: 'ios' | 'android' | 'huawei') => {
    switch (platform) {
        case 'dxtrade':
            return getPlatformDXTradeDownloadLink(type);
        case 'derivez':
            return getPlatformDerivEZDownloadLink(type);
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

const DERIVEZ_URL = 'https://dqwsqxuu0r6t9.cloudfront.net/';
const DERIVEZ_IOS_APP_URL = 'https://apps.apple.com/my/app/deriv-go/id1550561298';
const DERIVEZ_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.app&pli=1';
const DERIVEZ_HUAWEI_APP_URL = 'https://appgallery.huawei.com/#/app/C103801913';

const DXTRADE_IOS_APP_URL = 'https://apps.apple.com/us/app/deriv-x/id1563337503';
const DXTRADE_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.dx';
const DXTRADE_HUAWEI_APP_URL = 'https://appgallery.huawei.com/app/C104633219';

const getBrokerName = () => 'Deriv Limited';

const getTopUpConfig = () => {
    return {
        minimum_amount: 1000,
        additional_amount: 10000,
    };
};

const getPlatformDXTradeDownloadLink = (platform?: 'ios' | 'android' | 'huawei') => {
    switch (platform) {
        case 'ios':
            return DXTRADE_IOS_APP_URL;
        case 'huawei':
            return DXTRADE_HUAWEI_APP_URL;
        case 'android':
            return DXTRADE_ANDROID_APP_URL;
        default:
            return '';
    }
};

const getPlatformDerivEZDownloadLink = (platform: 'ios' | 'android' | 'huawei') => {
    switch (platform) {
        case 'ios':
            return DERIVEZ_IOS_APP_URL;
        case 'android':
            return DERIVEZ_ANDROID_APP_URL;
        case 'huawei':
            return DERIVEZ_HUAWEI_APP_URL;
        default:
            return '';
    }
};

const getPlatformMt5DownloadLink = (platform: string | undefined = undefined) => {
    switch (platform || OSDetect()) {
        case 'windows':
            return 'https://download.mql5.com/cdn/web/deriv.limited/mt5/derivmt5setup.exe';
        case 'linux':
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case 'ios':
            return 'https://apps.apple.com/us/app/metatrader-5/id413251709';
        case 'macos':
            return 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg';
        case 'huawei':
            return 'https://appgallery.huawei.com/#/app/C102015329';
        case 'android':
            return 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server';
        default:
            return getMT5WebTerminalLink({ category: 'real' }); // Web
    }
};

const getDXTradeWebTerminalLink = (category: string, token?: string) => {
    let url = category === 'real' ? REAL_DXTRADE_URL : DEMO_DXTRADE_URL;

    if (token) {
        url += `?token=${token}`;
    }

    return url;
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
    const is_demo = category === 'demo';
    const server = is_demo ? 'Deriv-Demo' : server_name;
    const login = loginid ?? '';

    return `https://metatraderweb.app/trade?servers=${server}&trade_server=${server}${login && `&login=${login}`}`;
};

export {
    REAL_DXTRADE_URL,
    DEMO_DXTRADE_URL,
    DERIVEZ_URL,
    getBrokerName,
    platformsText,
    platformsIcons,
    getTitle,
    mobileDownloadLink,
    getPlatformDXTradeDownloadLink,
    getPlatformDerivEZDownloadLink,
    getPlatformMt5DownloadLink,
    getDXTradeWebTerminalLink,
    getDerivEzWebTerminalLink,
    getMT5WebTerminalLink,
    getTopUpConfig,
};
