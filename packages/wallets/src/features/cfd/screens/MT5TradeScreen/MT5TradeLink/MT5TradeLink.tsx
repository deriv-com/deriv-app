import React, { FC } from 'react';
import { useCtraderServiceToken } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Divider, Text } from '@deriv-com/ui';
import { getPlatformFromUrl } from '../../../../../helpers/urls';
import { THooks, TPlatforms } from '../../../../../types';
import { CFD_PLATFORMS, getAppToContentMapper, PlatformDetails } from '../../../constants';
import { ctraderLinks, dxtradeLinks } from './urlConfig';
import './MT5TradeLink.scss';

type TMT5TradeLinkProps = {
    app?: keyof ReturnType<typeof getAppToContentMapper>;
    isDemo?: THooks.ActiveWalletAccount['is_virtual'];
    mt5TradeAccount?: THooks.MT5AccountsList;
    platform?: TPlatforms.All;
};

const MT5TradeLink: FC<TMT5TradeLinkProps> = ({ app = 'linux', isDemo = false, mt5TradeAccount, platform }) => {
    const { mutateAsync: requestToken } = useCtraderServiceToken();
    const { localize } = useTranslations();
    const { icon, link, text, title } = getAppToContentMapper(localize, mt5TradeAccount)[app];

    const getCtraderToken = () => {
        const cTraderTokenResponse = requestToken({
            payload: { server: isDemo ? 'demo' : 'real', service: CFD_PLATFORMS.CTRADER },
        });
        return cTraderTokenResponse;
    };

    const onClickWebTerminal = async () => {
        const { isStaging, isTestLink } = getPlatformFromUrl();
        let url, ctraderToken, ctraderURL;
        switch (platform) {
            case CFD_PLATFORMS.DXTRADE:
                url = isDemo ? dxtradeLinks.demo : dxtradeLinks.live;
                break;
            case CFD_PLATFORMS.CTRADER:
                ctraderURL = isTestLink || isStaging ? ctraderLinks.staging : ctraderLinks.live;
                try {
                    const { service_token: serviceToken } = await getCtraderToken();
                    ctraderToken = serviceToken?.ctrader?.token;
                } catch (error) {
                    /* eslint-disable no-console */
                    console.error('Failed to fetch cTrader token:', error);
                }
                url = ctraderToken ? `${ctraderURL}/?token=${ctraderToken}` : ctraderURL;
                break;
            default:
                url = '';
        }

        window.open(url);
    };

    return (
        <React.Fragment>
            <Divider color='var(--border-divider)' height={2} />
            <div className='wallets-mt5-trade-link'>
                <div className='wallets-mt5-trade-link--left'>
                    {(platform === CFD_PLATFORMS.MT5 || app === CFD_PLATFORMS.CTRADER) && (
                        <React.Fragment>
                            {icon}
                            <Text size='sm'>{title}</Text>
                        </React.Fragment>
                    )}
                    {platform !== CFD_PLATFORMS.MT5 && app !== CFD_PLATFORMS.CTRADER && (
                        <Text size='sm'>
                            <Localize
                                i18n_default_text='Run {{platformTitle}} on your browser'
                                values={{
                                    platformTitle:
                                        PlatformDetails[
                                            (platform as keyof typeof PlatformDetails) ?? CFD_PLATFORMS.DXTRADE
                                        ].title,
                                }}
                            />
                        </Text>
                    )}
                </div>
                {(platform === CFD_PLATFORMS.MT5 || app === CFD_PLATFORMS.CTRADER) && (
                    <Button
                        borderWidth='sm'
                        color='black'
                        onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
                        size='sm'
                        variant='outlined'
                    >
                        {text}
                    </Button>
                )}
                {platform !== CFD_PLATFORMS.MT5 && app !== CFD_PLATFORMS.CTRADER && (
                    <Button borderWidth='sm' color='black' onClick={onClickWebTerminal} size='sm' variant='outlined'>
                        <Text color='black' size='xs' weight='bold'>
                            <Localize i18n_default_text='Web terminal' />
                        </Text>
                    </Button>
                )}
            </div>
        </React.Fragment>
    );
};

export default MT5TradeLink;
