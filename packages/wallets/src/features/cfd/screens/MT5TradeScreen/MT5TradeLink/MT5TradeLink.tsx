import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCtraderServiceToken } from '@deriv/api-v2';
import { WalletButton, WalletText } from '../../../../../components/Base';
import { getPlatformFromUrl } from '../../../../../helpers/urls';
import { THooks, TPlatforms } from '../../../../../types';
import { AppToContentMapper, CFD_PLATFORMS, PlatformDetails, PlatformToLabelIconMapper } from '../../../constants';
import { ctraderLinks, dxtradeLinks } from './urlConfig';
import './MT5TradeLink.scss';

type TMT5TradeLinkProps = {
    app?: keyof typeof AppToContentMapper;
    isDemo?: THooks.ActiveWalletAccount['is_virtual'];
    platform?: TPlatforms.All;
    webtraderUrl?: THooks.MT5AccountsList['webtrader_url'];
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app = 'linux', isDemo = false, platform, webtraderUrl = '' }) => {
    const { data: ctraderToken } = useCtraderServiceToken();
    const { t } = useTranslation();
    const { icon, link, text, title } = AppToContentMapper[app];

    const onClickWebTerminal = () => {
        const { isStaging, isTestLink } = getPlatformFromUrl();
        let url;
        switch (platform) {
            case CFD_PLATFORMS.DXTRADE:
                url = isDemo ? dxtradeLinks.demo : dxtradeLinks.live;
                break;
            case CFD_PLATFORMS.CTRADER:
                url = isTestLink || isStaging ? ctraderLinks.staging : ctraderLinks.live;
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
                {(platform === CFD_PLATFORMS.MT5 || app === CFD_PLATFORMS.CTRADER) && (
                    <React.Fragment>
                        {icon}
                        <WalletText size='sm'>{title}</WalletText>
                    </React.Fragment>
                )}
                {platform !== CFD_PLATFORMS.MT5 && app !== CFD_PLATFORMS.CTRADER && (
                    <WalletText size='sm'>
                        {t('Run {{platform}} on your browser', {
                            platform:
                                PlatformDetails[(platform as keyof typeof PlatformDetails) ?? CFD_PLATFORMS.DXTRADE]
                                    .title,
                        })}
                    </WalletText>
                )}
            </div>
            {(platform === CFD_PLATFORMS.MT5 || app === CFD_PLATFORMS.CTRADER) && (
                <WalletButton
                    onClick={() => window.open(app === 'web' ? webtraderUrl : link)}
                    size='sm'
                    variant='outlined'
                >
                    {text}
                </WalletButton>
            )}
            {platform !== CFD_PLATFORMS.MT5 && app !== CFD_PLATFORMS.CTRADER && (
                <button className='wallets-mt5-trade-link__platform' onClick={onClickWebTerminal}>
                    {
                        PlatformToLabelIconMapper[
                            (platform as keyof typeof PlatformToLabelIconMapper) ?? CFD_PLATFORMS.DXTRADE
                        ]
                    }
                    <WalletText color='white' size='xs' weight='bold'>
                        {t('Web terminal')}
                    </WalletText>
                </button>
            )}
        </div>
    );
};

export default MT5TradeLink;
