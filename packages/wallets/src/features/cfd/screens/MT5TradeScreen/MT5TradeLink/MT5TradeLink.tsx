import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCtraderServiceToken } from '@deriv/api-v2';
import { WalletButton, WalletText } from '../../../../../components/Base';
import { getPlatformFromUrl } from '../../../../../helpers/urls';
import { THooks, TPlatforms } from '../../../../../types';
import { AppToContentMapper, PlatformDetails, PlatformToLabelIconMapper } from '../../../constants';
import './MT5TradeLink.scss';

type TMT5TradeLinkProps = {
    app?: keyof typeof AppToContentMapper;
    isDemo?: THooks.ActiveWalletAccount['is_virtual'];
    platform?: TPlatforms.All;
    webtraderUrl?: THooks.MT5AccountsList['webtrader_url'];
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app = 'linux', isDemo = false, platform, webtraderUrl = '' }) => {
    const content = AppToContentMapper[app];
    const { data: ctraderToken } = useCtraderServiceToken();
    const { t } = useTranslation();

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
        <div className='wallets-mt5-trade-link'>
            <div className='wallets-mt5-trade-link--left'>
                {(platform === mt5Platform || app === ctraderPlatform) && (
                    <React.Fragment>
                        <div className='wallets-mt5-trade-link--left-icon'>{content.icon}</div>
                        <WalletText size='sm'>{content.title}</WalletText>
                    </React.Fragment>
                )}
                {platform !== mt5Platform && app !== ctraderPlatform && (
                    <WalletText size='sm'>
                        {t('Run {{platform}} on your browser', {
                            platform: PlatformDetails[platform ?? dxtradePlatform].title,
                        })}
                    </WalletText>
                )}
            </div>
            {(platform === mt5Platform || app === ctraderPlatform) && (
                <WalletButton
                    onClick={() => window.open(app === 'web' ? webtraderUrl : content.link)}
                    size='sm'
                    variant='outlined'
                >
                    {content.text}
                </WalletButton>
            )}
            {platform !== mt5Platform && app !== ctraderPlatform && (
                <button className='wallets-mt5-trade-link__platform' onClick={onClickWebTerminal}>
                    {PlatformToLabelIconMapper[platform ?? dxtradePlatform]}
                    <WalletText color='white' size='xs' weight='bold'>
                        {t('Web terminal')}
                    </WalletText>
                </button>
            )}
        </div>
    );
};

export default MT5TradeLink;
