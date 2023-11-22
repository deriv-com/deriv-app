import React from 'react';
import { useHistory } from 'react-router-dom';
import { WalletButton, WalletCard, WalletText } from '../../../../../../components';
import ArrowDown from '../../../../../../public/images/ic-back-arrow.svg';
import { WithdrawalCryptoDestinationAddress } from './components';
import './WithdrawalCryptoReceipt.scss';

type TProps = {
    onClose: () => void;
    withdrawalReceipt: {
        address: string;
        amount: string;
        currency?: string;
    };
};

const WithdrawalCryptoReceipt: React.FC<TProps> = ({ onClose, withdrawalReceipt }) => {
    const history = useHistory();
    const { address, amount, currency } = withdrawalReceipt;

    return (
        <div className='wallets-withdrawal-crypto-receipt'>
            <div className='wallets-withdrawal-crypto-receipt__accounts-info'>
                <WalletCard balance={`-${amount} ${currency}`} currency={currency ?? ''} landingCompanyName='SVG' />
                <ArrowDown />
                <WithdrawalCryptoDestinationAddress address={address} />
            </div>
            <div className='wallets-withdrawal-crypto-receipt__withdrawal-info'>
                <WalletText align='center' size='xl' weight='bold'>
                    {amount} {currency}
                </WalletText>
                <WalletText align='center'>
                    Your withdrawal is currently in review. It will be processed within 24 hours. We&rsquo;ll send you
                    an email once your transaction has been processed.
                </WalletText>
            </div>
            <div className='wallets-withdrawal-crypto-receipt__actions'>
                <WalletButton
                    color='white'
                    onClick={() => history.push('/wallets/cashier/transactions')}
                    text='View Transactions'
                    variant='outlined'
                />
                <WalletButton onClick={onClose} text='Close' />
            </div>
        </div>
    );
};

export default WithdrawalCryptoReceipt;
