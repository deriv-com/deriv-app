import React from 'react';
import { WalletText } from '../../../../components/Base';
import { WalletListCardBadge } from '../../../../components';
import { MT5TradeDetailsItem } from './MT5TradeDetailsItem';
import ImportantIcon from '../../../../public/images/ic-important.svg';
import useDevice from '../../../../hooks/useDevice';
import { MT5TradeLink } from './MT5TradeLink';
import './MT5TradeScreen.scss';
import { useModal } from '../../../../components/ModalProvider';
import { MarketTypeToIconMapper, MarketTypeToTitleMapper } from '../../constants';
import { useActiveWalletAccount, useMT5AccountsList } from '@deriv/api';

const MT5TradeScreen = () => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const { data } = useMT5AccountsList();
    const { data: activeWalletData } = useActiveWalletAccount();

    const marketType = getModalState('marketType');
    const details = data?.filter(account => account.market_type === marketType)[0];

    return (
        <div className='wallets-mt5-trade-screen'>
            <div className='wallets-mt5-trade-screen__details'>
                <div className='wallets-mt5-trade-screen__details-description'>
                    <div className='wallets-mt5-trade-screen__details-description--left'>
                        {MarketTypeToIconMapper[marketType || 'all']}
                        <div className='wallets-mt5-trade-screen__label'>
                            <div className='wallets-mt5-trade-screen__title'>
                                <WalletText lineHeight='3xs' size='sm'>
                                    {MarketTypeToTitleMapper[marketType || 'all']}{' '}
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
                    <MT5TradeDetailsItem label='Broker' value='Deriv Holdings (Guernsey) Ltd' />
                    <MT5TradeDetailsItem label='Server' value={details?.server_info?.environment || 'Deriv-Server'} />
                    <MT5TradeDetailsItem label='Login ID' value={details?.loginid || '12345678'} />
                    <MT5TradeDetailsItem label='Password' value='********' variant='password' />
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
                <MT5TradeLink app='web' webtraderUrl={details?.webtrader_url} />
                {isDesktop && (
                    <>
                        <MT5TradeLink app='windows' />
                        <MT5TradeLink app='macos' />
                        <MT5TradeLink app='linux' />
                    </>
                )}
            </div>
        </div>
    );
};

export default MT5TradeScreen;
