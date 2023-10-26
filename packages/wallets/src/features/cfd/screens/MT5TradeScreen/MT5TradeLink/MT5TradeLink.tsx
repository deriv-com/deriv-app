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

type TMT5TradeLinkProps = {
    app: keyof typeof AppToIconMapper;
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app }) => {
    return (
        <div className='wallets-mt5-trade-link'>
            <div className='wallets-mt5-trade-link--left'>
                <div className='wallets-mt5-trade-link--left-icon'>{AppToIconMapper[app]}</div>
                <WalletText size='sm'>{AppToTitleMapper[app]}</WalletText>
            </div>
            <WalletButton size='sm' text={AppToButtonTextMapper[app]} variant='outlined' />
        </div>
    );
};

export default MT5TradeLink;
