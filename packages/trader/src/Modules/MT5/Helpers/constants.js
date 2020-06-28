import { OSDetect } from '@deriv/shared/utils/os';

const getPlatformMt5DownloadLink = (platform = undefined, is_eu = false) => {
    switch (platform || OSDetect()) {
        case 'windows':
            if (is_eu) {
                return 'https://download.mql5.com/cdn/web/16177/mt5/binarycom5setup.exe';
            }
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

const getMT5WebTerminalLink = ({ is_eu, category, loginid }) => {
    const is_demo = category === 'demo';
    const host = is_eu ? 'Binary.com' : 'Deriv'; // TODO Use deriv for eu as well, when migration is done
    const server = is_demo ? `${host}-Demo` : `${host}-Server`;
    const login = loginid ?? '';

    return `https://trade.mql5.com/trade?servers=${server}&trade_server=${server}${login && `&login=${login}`}`;
};

export { getPlatformMt5DownloadLink, getMT5WebTerminalLink };
