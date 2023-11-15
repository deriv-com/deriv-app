import React from 'react';
import ArrowDown from '../../../../public/images/ic-back-arrow.svg';
import { WalletButton, WalletCard, WalletText } from '../../../../components';
import { WithdrawalCryptoDestinationAddress } from './components';
import './WithdrawalCryptoReview.scss';
import useDevice from '../../../../hooks/useDevice';

const WithdrawalCryptoReview = () => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-withdrawal-crypto-review'>
            <div className='wallets-withdrawal-crypto-review__accounts-info'>
                <WalletCard
                    balance='1.00000000'
                    currency='BTC'
                    landingCompanyName='SVG'
                    width={isMobile ? '1.6rem' : '20rem'}
                />
                <ArrowDown />
                <WithdrawalCryptoDestinationAddress />
            </div>
            <div className='wallets-withdrawal-crypto-review__withdrawal-info'>
                <WalletText align='center' size='xl' weight='bold'>
                    1.00000000 BTC
                </WalletText>
                <WalletText align='center'>
                    Your withdrawal is currently in review. It will be processed within 24 hours. We&rsquo;ll send you
                    an email once your transaction has been processed.
                </WalletText>
            </div>
            <div className='wallets-withdrawal-crypto-review__actions'>
                <WalletButton color='white' text='View Transactions' variant='outlined' />
                <WalletButton text='Close' />
            </div>
        </div>
    );
};

export default WithdrawalCryptoReview;
