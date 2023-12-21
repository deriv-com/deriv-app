import React, { FC } from 'react';
import { useActiveTradingAccount, useCtraderServiceToken } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { getPlatformFromUrl } from '../../../../../helpers/urls';
import { THooks, TPlatforms } from '../../../../../types';
import { AppToContentMapper, PlatformDetails, PlatformToLabelIconMapper, PlatformUrls } from '../../../constants';

type TMT5TradeLinkProps = {
    app?: keyof typeof AppToContentMapper;
    platform?: TPlatforms.All;
    webtraderUrl?: THooks.MT5AccountsList['webtrader_url'];
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app = 'linux', platform, webtraderUrl = '' }) => {
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
        switch (platform) {
            case dxtradePlatform:
                url = isDemo ? PlatformUrls.dxtrade.demo : PlatformUrls.dxtrade.live;
                break;
            case ctraderPlatform:
                url = isTestLink || isStaging ? PlatformUrls.ctrader.staging : PlatformUrls.ctrader.live;
                if (ctraderToken) url += `?token=${ctraderToken}`;
                break;
            default:
                url = '';
        }
        window.open(url);
    };

    return (
        <div className='flex items-center justify-between border-t border-system-light-secondary-background px-800 py-1200'>
            <div className='flex items-center gap-800'>
                {(platform === mt5Platform || app === ctraderPlatform) && (
                    <React.Fragment>
                        <div className='w-1600 h-1600'>{content.icon}</div>
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
                    className='flex items-center bg-black border-none rounded-md cursor-pointer p-400 gap-400'
                    onClick={onClickWebTerminal}
                >
                    {PlatformToLabelIconMapper[platform ?? dxtradePlatform]}
                    <Text bold colorStyle='white' size='sm'>
                        Web terminal
                    </Text>
                </button>
            )}
        </div>
    );
};

export default MT5TradeLink;
