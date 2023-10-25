import React from 'react';
import { WalletClipboard, WalletText } from '../../../../../components/Base';
import './MT5TradeClipboard.scss';

const MT5TradeClipboard = () => {
    return (
        <div className='wallets-mt5-trade-clipboard'>
            <WalletText size='md' color='less-prominent'>
                Server
            </WalletText>
            <div className='wallets-mt5-trade-clipboard__values'>
                <WalletText size='md' weight='bold'>
                    Deriv-Demo
                </WalletText>
                <WalletClipboard textCopy='lol' successMessage='lol' popoverAlignment='right' />
            </div>
        </div>
    );
};

export default MT5TradeClipboard;
