import { OSDetect } from '@deriv/shared';

const getServerName = is_demo => (is_demo ? 'Deriv-Demo' : 'Deriv-Server');

const getBrokerName = () => 'Deriv Limited';

const getPlatformMt5DownloadLink = (platform = undefined) => {
    switch (platform || OSDetect()) {
        case 'windows':
            return 'https://download.mql5.com/cdn/web/deriv.limited/mt5/deriv5setup.exe';
        case 'linux':
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case 'ios':
            return 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server';
        case 'android':
            return 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server';
        default:
            return getMT5WebTerminalLink({ category: 'real' }); // Web
    }
};

const getMT5WebTerminalLink = ({ category, loginid }) => {
    const is_demo = category === 'demo';
    const server = is_demo ? 'Deriv-Demo' : 'Deriv-Server';
    const login = loginid ?? '';

    return `https://trade.mql5.com/trade?servers=${server}&trade_server=${server}${login && `&login=${login}`}`;
};

export { getServerName, getBrokerName, getPlatformMt5DownloadLink, getMT5WebTerminalLink };
