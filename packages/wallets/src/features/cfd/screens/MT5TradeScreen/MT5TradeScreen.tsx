import React from 'react';
import { MarketTypeToIconMapper } from '../../constants';
import { WalletButton, WalletClipboard, WalletText } from '../../../../components/Base';
import DerivedMT5Icon from '../../../../public/images/mt5-derived.svg';
import './MT5TradeScreen.scss';
import { MT5TradeClipboard } from './MT5TradeClipboard';
import ImportantIcon from '../../../../public/images/ic-important.svg';
import MT5Icon from '../../../../public/images/ic-mt5.svg';

const MT5TradeScreen = () => {
    return (
        <div className='wallets-mt5-trade-screen'>
            <div className='wallets-mt5-trade-screen__details'>
                <div className='wallets-mt5-trade-screen__details--left'>
                    <DerivedMT5Icon />
                    <div className='wallets-mt5-trade-screen__details-title'>
                        <WalletText size='lg'>Derived</WalletText>
                        <WalletText size='sm' color='less-prominent'>
                            12345678
                        </WalletText>
                    </div>
                </div>
                <WalletText weight='bold'>0.00 USD</WalletText>
            </div>

            <div className='wallets-mt5-trade-screen__clipboards'>
                <MT5TradeClipboard />
                <MT5TradeClipboard />
                <MT5TradeClipboard />
                <MT5TradeClipboard />
            </div>

            <div className='wallets-mt5-trade-screen__maintainance'>
                <ImportantIcon />
                <WalletText size='xs' color='less-prominent'>
                    Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to
                    complete. Service may be disrupted during this time.
                </WalletText>
            </div>

            <div className='wallets-mt5-trade-screen__metatrader'>
                <MT5Icon />
                <WalletText>MetaTrader 5 web</WalletText>
                <WalletButton text='Open' size='sm' variant='outlined' />
            </div>
        </div>
    );
};

export default MT5TradeScreen;
