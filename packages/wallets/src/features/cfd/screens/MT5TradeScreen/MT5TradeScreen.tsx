import React, { FC, useMemo } from 'react';
import { useActiveWalletAccount, useCtraderAccountsList, useDxtradeAccountsList } from '@deriv/api';
import { WalletListCardBadge } from '../../../../components';
import { InlineMessage, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import ImportantIcon from '../../../../public/images/ic-important.svg';
import { THooks } from '../../../../types';
import { MarketTypeDetails, PlatformDetails } from '../../constants';
import { MT5TradeDetailsItem } from './MT5TradeDetailsItem';
import { MT5TradeLink } from './MT5TradeLink';
import './MT5TradeScreen.scss';

type MT5TradeScreenProps = {
    mt5Account?: THooks.MT5AccountsList;
};

const MT5TradeScreen: FC<MT5TradeScreenProps> = ({ mt5Account }) => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: activeWalletData } = useActiveWalletAccount();

    const marketType = getModalState('marketType');
    const platform = getModalState('platform');

    const platformToAccountsListMapper = useMemo(
        () => ({
            ctrader: ctraderAccountsList,
            dxtrade: dxtradeAccountsList,
            mt5: [mt5Account],
        }),
        [ctraderAccountsList, dxtradeAccountsList, mt5Account]
    );

    const details = useMemo(() => {
        return platform === PlatformDetails?.mt5?.id
            ? platformToAccountsListMapper.mt5?.filter(account => account?.market_type === marketType)[0]
            : platformToAccountsListMapper.dxtrade?.[0];
    }, [platform, marketType, platformToAccountsListMapper]);

    const loginId = useMemo(() => {
        if (platform === PlatformDetails?.mt5?.id) {
            return (details as THooks.MT5AccountsList)?.loginid;
        } else if (platform === PlatformDetails?.dxtrade?.id) {
            return (details as THooks.DxtradeAccountsList)?.account_id;
        }
        return details?.login;
    }, [details, platform]);

    return (
        <div className='wallets-mt5-trade-screen'>
            <div className='wallets-mt5-trade-screen__details'>
                <div className='wallets-mt5-trade-screen__details-description'>
                    <div className='wallets-mt5-trade-screen__details-description--left'>
                        {platform === PlatformDetails.mt5.id
                            ? MarketTypeDetails[marketType || MarketTypeDetails.all.id].icon
                            : PlatformDetails[platform || PlatformDetails.dxtrade.id].icon}
                        <div className='wallets-mt5-trade-screen__label'>
                            <div className='wallets-mt5-trade-screen__title'>
                                <WalletText lineHeight='3xs' size='sm'>
                                    {platform === PlatformDetails.mt5.id
                                        ? MarketTypeDetails[marketType || MarketTypeDetails.all.id].title
                                        : PlatformDetails[platform || PlatformDetails.dxtrade.id].title}{' '}
                                    {!activeWalletData?.is_virtual && details?.landing_company_short?.toUpperCase()}
                                </WalletText>
                                {activeWalletData?.is_virtual && <WalletListCardBadge isDemo label='virtual' />}
                            </div>
                            <WalletText color='less-prominent' size='xs'>
                                {loginId}
                            </WalletText>
                        </div>
                    </div>
                    <div className='wallets-mt5-trade-screen__details-description--right'>
                        <WalletText weight='bold'>{details?.display_balance}</WalletText>
                        {!activeWalletData?.is_virtual &&
                            details?.landing_company_short === 'svg' &&
                            ['synthetic', 'financial'].includes(marketType || '') && (
                                <InlineMessage type='warning' variant='outlined'>
                                    No new positions
                                </InlineMessage>
                            )}
                    </div>
                </div>

                <div className='wallets-mt5-trade-screen__details-clipboards'>
                    {getModalState('platform') === PlatformDetails.mt5.id && (
                        <>
                            <MT5TradeDetailsItem label='Broker' value='Deriv Holdings (Guernsey) Ltd' />
                            <MT5TradeDetailsItem
                                label='Server'
                                value={details?.server_info?.environment || 'Deriv-Server'}
                            />
                            <MT5TradeDetailsItem label='Login ID' value={loginId || '12345678'} />
                            <MT5TradeDetailsItem label='Password' value='********' variant='password' />
                        </>
                    )}
                    {getModalState('platform') === PlatformDetails.dxtrade.id && (
                        <>
                            <MT5TradeDetailsItem label='Username' value={details?.login || '12345678'} />
                            <MT5TradeDetailsItem label='Password' value='********' variant='password' />
                        </>
                    )}
                    {getModalState('platform') === PlatformDetails.ctrader.id && (
                        <MT5TradeDetailsItem
                            value=' Use your Deriv account email and password to login into the cTrader platform.'
                            variant='info'
                        />
                    )}
                </div>

                <div className='wallets-mt5-trade-screen__details-maintainance'>
                    <ImportantIcon />
                    <WalletText color='less-prominent' size='2xs'>
                        Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to
                        complete. Service may be disrupted during this time.
                    </WalletText>
                </div>
            </div>
            <div className='wallets-mt5-trade-screen__links'>
                {isDesktop && platform === PlatformDetails.mt5.id && (
                    <>
                        <MT5TradeLink
                            app='web'
                            platform={PlatformDetails.mt5.id}
                            webtraderUrl={(details as THooks.MT5AccountsList)?.webtrader_url}
                        />
                        <MT5TradeLink app='windows' platform={PlatformDetails.mt5.id} />
                        <MT5TradeLink app='macos' platform={PlatformDetails.mt5.id} />
                        <MT5TradeLink app='linux' platform={PlatformDetails.mt5.id} />
                    </>
                )}
                {platform === PlatformDetails.dxtrade.id && (
                    <MT5TradeLink isDemo={activeWalletData?.is_virtual} platform={PlatformDetails.dxtrade.id} />
                )}
                {platform === PlatformDetails.ctrader.id && (
                    <>
                        <MT5TradeLink app='ctrader' platform={PlatformDetails.ctrader.id} />
                        <MT5TradeLink platform={PlatformDetails.ctrader.id} />
                    </>
                )}
            </div>
        </div>
    );
};

export default MT5TradeScreen;
