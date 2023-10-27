import React, { FC } from 'react';
import { WalletButton, WalletText } from '../../../../../components/Base';
import MT5Icon from '../../../../../public/images/ic-mt5.svg';
import WindowsIcon from '../../../../../public/images/ic-windows-logo.svg';
import MacOSIcon from '../../../../../public/images/ic-macos-logo.svg';
import LinuxIcon from '../../../../../public/images/ic-linux-logo.svg';
import './MT5TradeLink.scss';

const AppToContentMapper = {
    linux: {
        icon: <LinuxIcon />,
        link: 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux',
        text: 'Learn more',
        title: 'MetaTrader 5 Linux app',
    },
    macos: {
        icon: <MacOSIcon />,
        link: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg',
        text: 'Download',
        title: 'MetaTrader 5 MacOS app',
    },
    web: {
        icon: <MT5Icon />,
        link: '',
        text: 'Open',
        title: 'MetaTrader 5 web',
    },
    windows: {
        icon: <WindowsIcon />,
        link: 'https://download.mql5.com/cdn/web/deriv.com.limited/mt5/deriv5setup.exe',
        text: 'Download',
        title: 'MetaTrader 5 Windows app',
    },
};

type TMT5TradeLinkProps = {
    app: keyof typeof AppToContentMapper;
    webtraderUrl?: string;
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app, webtraderUrl = '' }) => {
    const content = AppToContentMapper[app];
    return (
        <div className='wallets-mt5-trade-link'>
            <div className='wallets-mt5-trade-link--left'>
                <div className='wallets-mt5-trade-link--left-icon'>{content.icon}</div>
                <WalletText size='sm'>{content.title}</WalletText>
            </div>
            <WalletButton
                onClick={() => window.open(app === 'web' ? webtraderUrl : content.link)}
                size='sm'
                text={content.text}
                variant='outlined'
            />
        </div>
    );
};

export default MT5TradeLink;
