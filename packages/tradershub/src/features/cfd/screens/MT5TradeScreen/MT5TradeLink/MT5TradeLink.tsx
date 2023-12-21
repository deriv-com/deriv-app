import React, { FC } from 'react';
import { useCtraderServiceToken } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { getPlatformFromUrl } from '../../../../../helpers/urls';
import { THooks, TPlatforms } from '../../../../../types';
import { AppToContentMapper, PlatformDetails, PlatformToLabelIconMapper, PlatformUrls } from '../../../constants';

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
