import React, { FC } from 'react';
import { WalletButton, WalletText } from '../../../../../components/Base';
import MT5Icon from '../../../../../public/images/ic-mt5.svg';
import WindowsIcon from '../../../../../public/images/ic-windows-logo.svg';
import MacOSIcon from '../../../../../public/images/ic-macos-logo.svg';
import LinuxIcon from '../../../../../public/images/ic-linux-logo.svg';
import './MT5TradeLink.scss';

const AppToIconMapper = {
    linux: <LinuxIcon />,
    macos: <MacOSIcon />,
    web: <MT5Icon />,
    windows: <WindowsIcon />,
};

const AppToTitleMapper = {
    linux: 'MetaTrader 5 Linux app',
    macos: 'MetaTrader 5 MacOS app',
    web: 'MetaTrader 5 web',
    windows: 'MetaTrader 5 Windows app',
};

const AppToButtonTextMapper = {
    linux: 'Learn more',
    macos: 'Download',
    web: 'Open',
    windows: 'Download',
};

const AppToLinkMapper = {
    windows: 'https://download.mql5.com/cdn/web/deriv.com.limited/mt5/deriv5setup.exe',
    linux: 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux',
    macos: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg',
};

type TMT5TradeLinkProps = {
    app: keyof typeof AppToIconMapper;
    webtraderUrl?: string;
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app, webtraderUrl = '' }) => {
    return (
        <div className='wallets-mt5-trade-link'>
            <div className='wallets-mt5-trade-link--left'>
                <div className='wallets-mt5-trade-link--left-icon'>{AppToIconMapper[app]}</div>
                <WalletText size='sm'>{AppToTitleMapper[app]}</WalletText>
            </div>
            <WalletButton
                onClick={() => window.open(app === 'web' ? webtraderUrl : AppToLinkMapper[app])}
                size='sm'
                text={AppToButtonTextMapper[app]}
                variant='outlined'
            />
        </div>
    );
};

export default MT5TradeLink;
