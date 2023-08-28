import React from 'react';
import Text from '../text';
import { WalletIcon } from '../wallet-icon';
import TradingPlatformIcon from './TradingPlatformIcon';
import { isMobile } from '@deriv/shared';
import './wallet-cfd-card.scss';

const WalletCFDCard = () => {
    return (
        <div className='wallet-cfd-card'>
            <div className='wallet-cfd-card__icon-wrapper'>
                <div className='wallet-cfd-card__cfd-icon'>
                    <TradingPlatformIcon icon='Derived' size={24} />
                </div>
                <div className='wallet-cfd-card__wallet-icon'>
                    <WalletIcon
                        gradient_class='wallet-card__demo-bg'
                        icon='IcWalletDerivDemoLight'
                        size='small'
                        type='demo'
                        has_bg
                        hide_watermark
                    />
                </div>
            </div>
            <div className='wallet-cfd-card__badge'>
                <Text color='colored-background' line_height='xxs' weight='bold' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                    Demo
                </Text>
            </div>
            <div className='wallet-cfd-card__details'>
                <Text color='prominent' weight='light' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                    MT5 Swap-Free
                </Text>
                <Text color='less-prominent' weight='light' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                    USD Wallet
                </Text>
                <Text color='prominent' weight='bold' size={isMobile() ? 'xxxs' : 'xxs'}>
                    10,000.00 USD
                </Text>
            </div>
        </div>
    );
};

export default WalletCFDCard;
