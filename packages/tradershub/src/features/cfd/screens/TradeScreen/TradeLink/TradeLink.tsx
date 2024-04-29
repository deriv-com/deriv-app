import React, { Fragment } from 'react';
import { getPlatformFromUrl } from '@/helpers';
import {
    AppToContentMapper,
    DesktopLinks,
    PlatformDetails,
    PlatformToLabelIconMapper,
    PlatformUrls,
} from '@cfd/constants';
import { useActiveTradingAccount, useCtraderServiceToken } from '@deriv/api-v2';
import { Button, Text } from '@deriv-com/ui';
import { THooks, TPlatforms } from '../../../../../types';

type TTradeLinkProps = {
    app: keyof typeof AppToContentMapper;
    isDemo?: boolean;
    platform?: TPlatforms.All;
    webtraderUrl?: THooks.MT5AccountsList['webtrader_url'];
};

const TradeLink = ({ app, platform, webtraderUrl = '' }: TTradeLinkProps) => {
    const content = AppToContentMapper[app];

    const { data: ctraderToken } = useCtraderServiceToken();
    const { data: activeAccount } = useActiveTradingAccount();

    const isDemo = activeAccount?.is_virtual;

    const mt5Platform = PlatformDetails.mt5.platform;
    const dxtradePlatform = PlatformDetails.dxtrade.platform;
    const ctraderPlatform = PlatformDetails.ctrader.platform;

    const onClickWebTerminal = () => {
        const { isStaging, isTestLink } = getPlatformFromUrl();
        let url;
        const platformType = isDemo ? 'demo' : 'live';
        const ctraderType = isTestLink || isStaging ? 'staging' : 'live';

        if (platform === dxtradePlatform || platform === ctraderPlatform) {
            url = PlatformUrls[platform][platform === ctraderPlatform ? ctraderType : platformType];
            if (platform === ctraderPlatform && ctraderToken) {
                url += `?token=${ctraderToken}`;
            }
        } else return '';

        window.open(url);
    };

    return (
        <div className='flex items-center justify-between px-16 py-24 border-solid border-t-1 border-system-light-secondary-background'>
            <div className='flex items-center gap-16'>
                {platform === mt5Platform && (
                    <Fragment>
                        <div className='w-1600 h-1600'>{content.icon}</div>
                        <Text size='sm'>{content.title}</Text>
                    </Fragment>
                )}
                {platform === dxtradePlatform && (
                    <Text size='sm'>Run {PlatformDetails[platform].title} on your browser</Text>
                )}
                {platform === ctraderPlatform && <Text size='sm'>{content.title}</Text>}
            </div>
            {platform === mt5Platform && (
                <Button
                    className='px-16 border-opacity-black-8 rounded-xs'
                    color='black'
                    onClick={() => window.open(app === 'mt5_web' ? webtraderUrl : content.link)}
                    size='sm'
                    variant='outlined'
                >
                    {content.text}
                </Button>
            )}
            {platform === ctraderPlatform && app !== DesktopLinks.CTRADER_WEB && (
                <Button
                    className='px-16 border-opacity-black-8 rounded-xs'
                    color='black'
                    onClick={() => window.open(content.link)}
                    size='sm'
                    variant='outlined'
                >
                    {content.text}
                </Button>
            )}
            {platform === ctraderPlatform && app === DesktopLinks.CTRADER_WEB && (
                <Button
                    className='flex items-center justify-center gap-8 p-8 border-none rounded-md cursor-pointer bg-system-dark-primary-background'
                    color='white'
                    onClick={onClickWebTerminal}
                    variant='outlined'
                >
                    <span className='flex items-center justify-center gap-8'>
                        {PlatformToLabelIconMapper[platform ?? ctraderPlatform]}
                        <Text className='text-system-light-primary-background' size='sm' weight='bold'>
                            Web terminal
                        </Text>
                    </span>
                </Button>
            )}
            {platform === dxtradePlatform && (
                <Button
                    className='flex items-center justify-center gap-8 p-8 border-none rounded-md cursor-pointer bg-system-dark-primary-background'
                    color='white'
                    onClick={onClickWebTerminal}
                    variant='outlined'
                >
                    <span className='flex items-center justify-center gap-8'>
                        {PlatformToLabelIconMapper[platform ?? dxtradePlatform]}
                        <Text className='text-system-light-primary-background' size='sm' weight='bold'>
                            Web terminal
                        </Text>
                    </span>
                </Button>
            )}
        </div>
    );
};

export default TradeLink;
