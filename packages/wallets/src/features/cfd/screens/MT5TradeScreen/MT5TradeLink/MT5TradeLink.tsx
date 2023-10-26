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
        title: 'MetaTrader 5 Linux app',
        text: 'Learn more',
    },
    macos: {
        icon: <MacOSIcon />,
        title: 'MetaTrader 5 MacOS app',
        text: 'Download',
    },
    web: {
        icon: <MT5Icon />,
        title: 'MetaTrader 5 web',
        text: 'Open',
    },
    windows: {
        icon: <WindowsIcon />,
        title: 'MetaTrader 5 Windows app',
        text: 'Download',
    },
};

type TMT5TradeLinkProps = {
    app: keyof typeof AppToContentMapper;
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app }) => {
    const content = AppToContentMapper[app];
    return (
        <div className='wallets-mt5-trade-link'>
            <div className='wallets-mt5-trade-link--left'>
                <div className='wallets-mt5-trade-link--left-icon'>{content.icon}</div>
                <WalletText size='sm'>{content.title}</WalletText>
            </div>
            <WalletButton size='sm' text={content.text} variant='outlined' />
        </div>
    );
};

export default MT5TradeLink;
