import { OSDetect } from '@deriv/shared';

const getServerName = is_demo => (is_demo ? 'Deriv-Demo' : 'Deriv-Server');

const getBrokerName = () => 'Deriv Limited';

const getTopUpConfig = () => {
    return {
        currency: 'USD',
        minimum_amount: 1000,
        additional_amount: 10000,
    };
};

const getPlatformDXTradeDownloadLink = (platform = undefined) => {
    switch (platform || OSDetect()) {
        case 'ios':
            return 'https://apps.apple.com/tt/app/dxtrade/id1510582738';
        case 'android':
            return 'https://play.google.com/store/apps/details?id=com.devexperts.dxmarket.client&hl=en';
        default:
            return getDXTradeWebTerminalLink(); // Web
    }
};

const getPlatformMt5DownloadLink = (platform = undefined) => {
    switch (platform || OSDetect()) {
        case 'windows':
            return 'https://download.mql5.com/cdn/web/deriv.limited/mt5/deriv5setup.exe';
        case 'linux':
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case 'macos':
            return 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg';
        case 'ios':
            return 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server';
        case 'android':
            return 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server';
        default:
            return getMT5WebTerminalLink({ category: 'real' }); // Web
    }
};

const getDXTradeWebTerminalLink = () => {
    return 'https://dx-demo.deriv.com/';
};

const getMT5WebTerminalLink = ({ category, loginid, server_name = 'Deriv-Server' }) => {
    const is_demo = category === 'demo';
    const server = is_demo ? 'Deriv-Demo' : server_name;
    const login = loginid ?? '';

    return `https://trade.mql5.com/trade?servers=${server}&trade_server=${server}${login && `&login=${login}`}`;
};

export {
    getServerName,
    getBrokerName,
    getPlatformDXTradeDownloadLink,
    getPlatformMt5DownloadLink,
    getDXTradeWebTerminalLink,
    getMT5WebTerminalLink,
    getTopUpConfig,
};
