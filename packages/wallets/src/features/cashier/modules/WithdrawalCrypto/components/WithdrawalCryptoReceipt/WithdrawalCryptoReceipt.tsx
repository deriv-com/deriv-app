import React from 'react';
import { useHistory } from 'react-router-dom';
import { LegacyArrowDown2pxIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import { WalletCard, WalletText } from '../../../../../../components';
import { TWithdrawalReceipt } from '../../types';
import { WithdrawalCryptoDestinationAddress } from './components';
import './WithdrawalCryptoReceipt.scss';

type TProps = {
    onClose: () => void;
    withdrawalReceipt: TWithdrawalReceipt;
};

const WithdrawalCryptoReceipt: React.FC<TProps> = ({ onClose, withdrawalReceipt }) => {
    const history = useHistory();
    const { address, amount, amountReceived, currency, transactionFee } = withdrawalReceipt;

    return (
        <div className='wallets-withdrawal-crypto-receipt'>
            <div className='wallets-withdrawal-crypto-receipt__accounts-info'>
                <WalletCard balance={`-${amount} ${currency}`} currency={currency ?? ''} iconSize='md' />
                <LegacyArrowDown2pxIcon iconSize='xs' />
                <WithdrawalCryptoDestinationAddress address={address} />
            </div>
            <div className='wallets-withdrawal-crypto-receipt__withdrawal-info'>
                <div className='wallets-withdrawal-crypto-receipt__amount-received-info'>
                    <WalletText align='center' as='p' size='sm'>
                        Amount received
                    </WalletText>
                    <WalletText align='center' size='xl' weight='bold'>
                        {transactionFee ? amountReceived : amount} {currency}
                    </WalletText>
                    {transactionFee && (
                        <WalletText align='center' as='p' size='sm'>
                            (Transaction fee: {transactionFee} {currency})
                        </WalletText>
                    )}
                </div>

                <WalletText align='center' as='p'>
                    Your withdrawal is currently in review. It will be processed within 24 hours. We&rsquo;ll send you
                    an email once your transaction has been processed.
                </WalletText>
            </div>
            <div className='wallets-withdrawal-crypto-receipt__actions'>
                <Button
                    color='black'
                    onClick={() => history.push('/wallet/transactions')}
                    size='lg'
                    textSize='md'
                    variant='outlined'
                >
                    View transactions
                </Button>
                <Button borderWidth='sm' onClick={onClose} size='lg' textSize='md'>
                    Close
                </Button>
            </div>
        </div>
    );
};

export default WithdrawalCryptoReceipt;
