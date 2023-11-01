import React, { FC } from 'react';
import { useCtraderServiceToken, useDerivezServiceToken } from '@deriv/api';
import { WalletButton, WalletText } from '../../../../../components/Base';
import { getPlatformFromUrl } from '../../../../../helpers/urls';
import CTraderLabelIcon from '../../../../../public/images/ctrader-label.svg';
import DerivEZLabelIcon from '../../../../../public/images/derivez-label.svg';
import DerivXLabelIcon from '../../../../../public/images/derivx-label.svg';
import LinuxIcon from '../../../../../public/images/ic-linux-logo.svg';
import MacOSIcon from '../../../../../public/images/ic-macos-logo.svg';
import MT5Icon from '../../../../../public/images/ic-mt5.svg';
import WindowsIcon from '../../../../../public/images/ic-windows-logo.svg';
import { THooks, TPlatforms } from '../../../../../types';
import { PlatformToTitleMapper } from '../../../constants';
import './MT5TradeLink.scss';

const AppToContentMapper = {
    ctrader: {
        icon: <WindowsIcon />,
        link: 'https://getctrader.com/deriv/ctrader-deriv-setup.exe',
        text: 'Download',
        title: 'CTrader Windows App',
    },
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

const PlatformToLabelIconMapper = {
    ctrader: <CTraderLabelIcon />,
    derivez: <DerivEZLabelIcon />,
    dxtrade: <DerivXLabelIcon />,
};

type TMT5TradeLinkProps = {
    app?: keyof typeof AppToContentMapper;
    isDemo?: boolean;
    platform?: TPlatforms.All;
    webtraderUrl?: THooks.MT5AccountsList['webtrader_url'];
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app = 'linux', isDemo = false, platform, webtraderUrl = '' }) => {
    const content = AppToContentMapper[app];
    const { data: ctraderToken } = useCtraderServiceToken();
    const { data: derivezToken } = useDerivezServiceToken();

    const onClickWebTerminal = () => {
        const { isStaging, isTestLink } = getPlatformFromUrl(window.location.hostname);
        let url;
        switch (platform) {
            case 'dxtrade':
                url = isDemo ? 'https://dx-demo.deriv.com' : 'https://dx.deriv.com';
                break;
            case 'ctrader':
                url = isTestLink || isStaging ? 'https://ct-uat.deriv.com' : 'https://ct.deriv.com';
                if (ctraderToken) url += `?token=${ctraderToken}`;
                break;
            case 'derivez':
                url = 'https://dqwsqxuu0r6t9.cloudfront.net';
                if (derivezToken) url += `?token=${derivezToken}`;
                break;
            default:
                url = '';
        }
        window.open(url);
    };

    return (
        <div className='wallets-mt5-trade-link'>
            <div className='wallets-mt5-trade-link--left'>
                {(platform === 'mt5' || app === 'ctrader') && (
                    <>
                        <div className='wallets-mt5-trade-link--left-icon'>{content.icon}</div>
                        <WalletText size='sm'>{content.title}</WalletText>
                    </>
                )}
                {platform !== 'mt5' && app !== 'ctrader' && (
                    <WalletText size='sm'>
                        Run {PlatformToTitleMapper[platform || 'derivez']} on your browser
                    </WalletText>
                )}
            </div>
            {(platform === 'mt5' || app === 'ctrader') && (
                <WalletButton
                    onClick={() => window.open(app === 'web' ? webtraderUrl : content.link)}
                    size='sm'
                    text={content.text}
                    variant='outlined'
                />
            )}
            {platform !== 'mt5' && app !== 'ctrader' && (
                <button className='wallets-mt5-trade-link__platform' onClick={onClickWebTerminal}>
                    {PlatformToLabelIconMapper[platform || 'derivez']}
                    <WalletText color='white' size='xs' weight='bold'>
                        Web terminal
                    </WalletText>
                </button>
            )}
        </div>
    );
};

export default MT5TradeLink;
