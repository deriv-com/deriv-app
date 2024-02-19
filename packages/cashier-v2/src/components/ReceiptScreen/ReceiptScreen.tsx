import React from 'react';
import { useHistory } from 'react-router-dom';
import { CurrencyBtcIcon, DerivLightWalletIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import ArrowDown from '../../assets/images/back-arrow.svg';
import styles from './ReceiptScreen.module.scss';

type TProps = {
    onClose: () => void;
    receipt: {
        amount?: string;
        from: {
            currency: string;
            id: string;
        };
        title: string;
        to: {
            currency: string;
            id: string;
        };
    };
};

const ReceiptScreen: React.FC<TProps> = ({ onClose, receipt }) => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { amount, from, title, to } = receipt;

    return (
        <div className={styles.container}>
            <Text align='center' as='span' weight='bold'>
                {title}
            </Text>
            <div className={styles.status}>
                <div className={styles['status-dot']} />
                <Text align='center' as='span' size='sm' weight='bold'>
                    In review
                </Text>
            </div>
            <div className={styles['transaction-details']}>
                <div className='wallets-withdrawal-crypto-receipt__withdrawal-info'>
                    <Text align='center' color='success' size='2xl' weight='bold'>
                        {amount} {from.currency}
                    </Text>
                </div>
                <div className={styles.account}>
                    <div className={styles['account-info']}>
                        <CurrencyBtcIcon iconSize={isMobile ? 'sm' : 'md'} />
                        <Text weight='bold'>{from.currency}</Text>
                    </div>
                    <div className={styles['account-id']}>
                        <Text color='less-prominent'>466578976</Text>
                    </div>
                </div>
                <div className={styles['arrow-down']}>
                    <ArrowDown />
                </div>
                <div className={styles.account}>
                    <div className={styles['account-info']}>
                        <DerivLightWalletIcon height={isMobile ? '24px' : '32px'} width={isMobile ? '24px' : '32px'} />
                        <Text weight='bold'>{to.currency} Wallet</Text>
                    </div>
                    <div className={styles['account-id']}>
                        <Text color='less-prominent'>466578976</Text>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <Button
                    color='white'
                    // onClick={() => history.push('/wallets/cashier/transactions')}
                    size='lg'
                    textSize='sm'
                    variant='outlined'
                >
                    View transaction history
                </Button>
                <Button onClick={onClose} size='lg' textSize='sm'>
                    Make a new withdrawal
                </Button>
            </div>
        </div>
    );
};

export default ReceiptScreen;
