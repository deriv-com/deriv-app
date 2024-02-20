import React from 'react';
import { CurrencyBtcIcon, DerivLightWalletIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import ArrowDown from '../../assets/images/back-arrow.svg';
import styles from './ReceiptScreen.module.scss';

type TProps = {
    actionButtons?: React.ReactNode;
    receipt: {
        amount?: string;
        from: {
            currency?: string;
            info?: React.ReactNode;
        };
        to: {
            currency?: string;
            info?: React.ReactNode;
        };
    };
    status?: string;
    title?: string;
};

const ReceiptScreen: React.FC<TProps> = ({ actionButtons, receipt, status, title }) => {
    const { isMobile } = useDevice();
    const { amount, from, to } = receipt;

    return (
        <div className={styles.container}>
            <Text align='center' as='span' weight='bold'>
                {title}
            </Text>
            {status && (
                <div className={styles.status}>
                    <div className={styles['status-dot']} />
                    <Text align='center' as='span' size='sm' weight='bold'>
                        {status}
                    </Text>
                </div>
            )}
            <div className={styles['transaction-details']}>
                <Text align='center' color='success' size='2xl' weight='bold'>
                    {amount} {from.currency}
                </Text>
                <div className={styles.account}>
                    <div className={styles['account-currency']}>
                        <CurrencyBtcIcon iconSize={isMobile ? 'sm' : 'md'} />
                        <Text weight='bold'>{from.currency}</Text>
                    </div>
                    <div className={styles['account-info']}>{from.info}</div>
                </div>
                <div className={styles['arrow-down']}>
                    <ArrowDown />
                </div>
                <div className={styles.account}>
                    <div className={styles['account-currency']}>
                        <DerivLightWalletIcon height={isMobile ? '24px' : '32px'} width={isMobile ? '24px' : '32px'} />
                        <Text weight='bold'>{to.currency} Wallet</Text>
                    </div>
                    <div className={styles['account-info']}>{to.info}</div>
                </div>
            </div>
            {actionButtons}
        </div>
    );
};

export default ReceiptScreen;
