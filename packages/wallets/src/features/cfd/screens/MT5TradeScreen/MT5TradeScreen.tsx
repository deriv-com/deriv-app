import React from 'react';
import { WalletText } from '../../../../components/Base';
import { WalletListCardBadge } from '../../../../components';
import { MT5TradeDetailsItem } from './MT5TradeDetailsItem';
import ImportantIcon from '../../../../public/images/ic-important.svg';
import useDevice from '../../../../hooks/useDevice';
import { MT5TradeLink } from './MT5TradeLink';
import './MT5TradeScreen.scss';
import { useModal } from '../../../../components/ModalProvider';
import { MarketTypeDetails, PlatformDetails } from '../../constants';
import { useActiveWalletAccount, useMT5AccountsList } from '@deriv/api';

const MT5TradeScreen = () => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const { data } = useMT5AccountsList();
    const { data: activeWalletData } = useActiveWalletAccount();

    const marketType = getModalState('marketType');
    const platform = getModalState('platform');
    const details = marketType
        ? data?.filter(account => account.market_type === marketType)[0]
        : data?.filter(account => account.platform === platform)[0];

    return (
        <div className='wallets-mt5-trade-screen'>
            <div className='wallets-mt5-trade-screen__details'>
                <div className='wallets-mt5-trade-screen__details-description'>
                    <div className='wallets-mt5-trade-screen__details-description--left'>
                        {platform === 'mt5'
                            ? MarketTypeDetails[marketType || 'all'].icon
                            : PlatformDetails[platform || 'dxtrade'].icon}
                        <div className='wallets-mt5-trade-screen__label'>
                            <div className='wallets-mt5-trade-screen__title'>
                                <WalletText lineHeight='3xs' size='sm'>
                                    {platform === 'mt5'
                                        ? MarketTypeDetails[marketType || 'all'].title
                                        : PlatformDetails[platform || 'dxtrade'].title}{' '}
                                    {details?.landing_company_short?.toUpperCase()}
                                </WalletText>
                                {activeWalletData?.is_virtual && <WalletListCardBadge isDemo label='virtual' />}
                            </div>
                            <WalletText color='less-prominent' size='xs'>
                                {details?.loginid}
                            </WalletText>
                        </div>
                    </div>
                    <div className='wallets-mt5-trade-screen__details-description--right'>
                        <WalletText weight='bold'>{details?.display_balance}</WalletText>
                        {!activeWalletData?.is_virtual &&
                            details?.landing_company_short === 'svg' &&
                            ['synthetic', 'financial'].includes(marketType || '') && (
                                <div className='wallets-mt5-trade-screen__badge'>
                                    <ImportantIcon />
                                    <WalletText color='warning' size='xs' weight='bold'>
                                        No new positions
                                    </WalletText>
                                </div>
                            )}
                    </div>
                </div>

                <div className='wallets-mt5-trade-screen__details-clipboards'>
                    {getModalState('platform') === 'mt5' && (
                        <>
                            <MT5TradeDetailsItem label='Broker' value='Deriv Holdings (Guernsey) Ltd' />
                            <MT5TradeDetailsItem
                                label='Server'
                                value={details?.server_info?.environment || 'Deriv-Server'}
                            />
                            <MT5TradeDetailsItem label='Login ID' value={details?.loginid || '12345678'} />
                            <MT5TradeDetailsItem label='Password' value='********' variant='password' />
                        </>
                    )}
                    {getModalState('platform') === 'dxtrade' && (
                        <>
                            <MT5TradeDetailsItem label='Username' value={details?.loginid || '12345678'} />
                            <MT5TradeDetailsItem label='Password' value='********' variant='password' />
                        </>
                    )}
                    {getModalState('platform') === 'ctrader' && (
                        <MT5TradeDetailsItem
                            value=' Use your Deriv account email and password to login into the cTrader platform.'
                            variant='info'
                        />
                    )}
                    {getModalState('platform') === 'derivez' && (
                        <MT5TradeDetailsItem
                            value=' If your browser detects no activity for 24 hours, you will have to relaunch Deriv EZ
                        from this window. Any open/pending trades will not be affected.'
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
                {isDesktop && platform === 'mt5' && (
                    <>
                        <MT5TradeLink app='web' platform='mt5' webtraderUrl={details?.webtrader_url} />
                        <MT5TradeLink app='windows' platform='mt5' />
                        <MT5TradeLink app='macos' platform='mt5' />
                        <MT5TradeLink app='linux' platform='mt5' />
                    </>
                )}
                {platform !== 'mt5' && platform !== 'ctrader' && (
                    <MT5TradeLink isDemo={activeWalletData?.is_virtual} platform={platform} />
                )}
                {platform === 'ctrader' && (
                    <>
                        <MT5TradeLink app='ctrader' platform={platform} />
                        <MT5TradeLink platform={platform} />
                    </>
                )}
            </div>
        </div>
    );
};

export default MT5TradeScreen;
