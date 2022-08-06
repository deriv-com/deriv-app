import { OSDetect } from '@deriv/shared';

const REAL_DXTRADE_URL = 'https://dx.deriv.com';
const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

const DXTRADE_IOS_APP_URL = 'https://apps.apple.com/us/app/deriv-x/id1563337503';
const DXTRADE_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.dx';

const getBrokerName = () => 'Deriv Limited';

const getTopUpConfig = () => {
    return {
        minimum_amount: 1000,
        additional_amount: 10000,
    };
};

const getPlatformDXTradeDownloadLink = (platform: 'ios' | 'android') => {
    if (platform === 'ios') {
        return DXTRADE_IOS_APP_URL;
    }
    return DXTRADE_ANDROID_APP_URL;
};

const getPlatformMt5DownloadLink = (platform: string | undefined = undefined) => {
    switch (platform || OSDetect()) {
        case 'windows':
            return 'https://download.mql5.com/cdn/web/deriv.limited/mt5/derivmt5setup.exe';
        case 'linux':
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case 'macos':
            return 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg';
        case 'ios':
            return 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server';
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

    return `https://trade.mql5.com/trade?servers=${server}&trade_server=${server}${login && `&login=${login}`}`;
};

const getMT5LicenceNotes = (account_type: string, card_type: string) => {
    switch (card_type) {
        case 'svg':
            return `Add your DMT5 ${account_type} account under Deriv (SVG) LLC (company no. 273 LLC 2020)`;
        case 'bvi':
            return `Add your DMT5 ${account_type} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/{{line_break}}L/18/1114).`;
        case 'vanuatu':
            return `Add Your DMT5 ${account_type} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.`;
        case 'labuan':
            return `Add your DMT5 ${account_type} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).`;
        case 'maltainvest':
            return `Add your DMT5 CFDs account under Deriv Investments (Europe) Limited regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).`;
        default:
            return null;
    }
};

export {
    getBrokerName,
    getPlatformDXTradeDownloadLink,
    getPlatformMt5DownloadLink,
    getDXTradeWebTerminalLink,
    getMT5WebTerminalLink,
    getTopUpConfig,
    getMT5LicenceNotes,
};
