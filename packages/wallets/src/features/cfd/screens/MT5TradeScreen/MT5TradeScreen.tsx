import React from 'react';
import { WalletText } from '../../../../components/Base';
import DerivedMT5Icon from '../../../../public/images/mt5-derived.svg';
import { MT5TradeClipboard } from './MT5TradeClipboard';
import ImportantIcon from '../../../../public/images/ic-important.svg';
import useDevice from '../../../../hooks/useDevice';
import { MT5TradeLink } from './MT5TradeLink';
import './MT5TradeScreen.scss';

const MT5TradeScreen = () => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-mt5-trade-screen'>
            <div className='wallets-mt5-trade-screen__details'>
                <div className='wallets-mt5-trade-screen__details-description'>
                    <div className='wallets-mt5-trade-screen__details-description--left'>
                        <DerivedMT5Icon />
                        <div className='wallets-mt5-trade-screen__details-description-title'>
                            <WalletText size='sm'>Derived</WalletText>
                            <WalletText color='less-prominent' size='xs'>
                                12345678
                            </WalletText>
                        </div>
                    </div>
                    <WalletText weight='bold'>0.00 USD</WalletText>
                </div>

                <div className='wallets-mt5-trade-screen__details-clipboards'>
                    <MT5TradeClipboard label='Broker' value='Deriv Holdings (Guernsey) Ltd' />
                    <MT5TradeClipboard label='Server' value='Deriv-Server' />
                    <MT5TradeClipboard label='Login ID' value='123456789' />
                    <MT5TradeClipboard label='Password' value='********' variant='password' />
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
                <MT5TradeLink app='web' />
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
