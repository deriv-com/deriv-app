import React, { FC } from 'react';
import { useCtraderServiceToken } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { getPlatformFromUrl } from '../../../../../helpers/urls';
import CTraderLabelIcon from '../../../../../public/images/ctrader-label.svg';
import DerivXLabelIcon from '../../../../../public/images/derivx-label.svg';
import LinuxIcon from '../../../../../public/images/ic-linux-logo.svg';
import MacOSIcon from '../../../../../public/images/ic-macos-logo.svg';
import MT5Icon from '../../../../../public/images/ic-mt5.svg';
import WindowsIcon from '../../../../../public/images/ic-windows-logo.svg';
import { THooks, TPlatforms } from '../../../../../types';
import { PlatformDetails } from '../../../constants';

type TAppContent = {
    icon: JSX.Element;
    link: string;
    text: string;
    title: string;
};

type AppToContentMapperType = {
    [key: string]: TAppContent;
};

const AppToContentMapper: AppToContentMapperType = {
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
    dxtrade: <DerivXLabelIcon />,
};

type TMT5TradeLinkProps = {
    app?: keyof typeof AppToContentMapper;
    isDemo?: THooks.ActiveAccount['is_virtual'];
    platform?: TPlatforms.All;
    webtraderUrl?: THooks.MT5AccountsList['webtrader_url'];
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app = 'linux', isDemo = false, platform, webtraderUrl = '' }) => {
    const content = AppToContentMapper[app];
    const { data: ctraderToken } = useCtraderServiceToken();

    const mt5Platform = PlatformDetails.mt5.platform;
    const dxtradePlatform = PlatformDetails.dxtrade.platform;
    const ctraderPlatform = PlatformDetails.ctrader.platform;

    const onClickWebTerminal = () => {
        const { isStaging, isTestLink } = getPlatformFromUrl();
        let url;
        switch (platform) {
            case dxtradePlatform:
                url = isDemo ? 'https://dx-demo.deriv.com' : 'https://dx.deriv.com';
                break;
            case ctraderPlatform:
                url = isTestLink || isStaging ? 'https://ct-uat.deriv.com' : 'https://ct.deriv.com';
                if (ctraderToken) url += `?token=${ctraderToken}`;
                break;
            default:
                url = '';
        }
        window.open(url);
    };

    return (
        <div className='flex justify-between items-center border-t border-[#f2f3f4] pt-4 px-6'>
            <div className='flex items-center gap-4'>
                {(platform === mt5Platform || app === ctraderPlatform) && (
                    <React.Fragment>
                        <div className='w-8 h-8'>{content.icon}</div>
                        <Text size='sm'>{content.title}</Text>
                    </React.Fragment>
                )}
                {platform !== mt5Platform && app !== ctraderPlatform && (
                    <Text size='sm'>Run {PlatformDetails[platform ?? dxtradePlatform].title} on your browser</Text>
                )}
            </div>
            {(platform === mt5Platform || app === ctraderPlatform) && (
                <Button
                    onClick={() => window.open(app === 'web' ? webtraderUrl : content.link)}
                    size='sm'
                    variant='outlined'
                >
                    {content.text}
                </Button>
            )}
            {platform !== mt5Platform && app !== ctraderPlatform && (
                <button
                    className='border-none cursor-pointer bg-black flex p-2 items-center gap-2 rounded-md'
                    onClick={onClickWebTerminal}
                >
                    {PlatformToLabelIconMapper[platform ?? dxtradePlatform]}
                    <Text color='white' size='xs' weight='bold'>
                        Web terminal
                    </Text>
                </button>
            )}
        </div>
    );
};

export default MT5TradeLink;
