import React from 'react';
import { DerivLightWalletIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { CurrencyIcon, ReceiptScreen, TradingAppIcon } from '../../../../components';
import { getLandingCompanyNameOfMT5Account, getMarketType } from '../../../../helpers';
import styles from './TransferReceipt.module.scss';

const TransferReceipt = ({ data }) => {
    const { isMobile } = useDevice();
    const { amount, fromAccount, toAccount } = data;

    const getToAccountName = account => {
        // console.log('=> account_type', account.account_type);
        if (account.account_type === 'binary') return account.currency;

        if (account.account_type === 'dxtrade') return 'Deriv X';

        if (account.account_type === 'mt5')
            return `${getMarketType(toAccount.mt5_group)} 
        ${getLandingCompanyNameOfMT5Account(toAccount.mt5_group).toUpperCase()}`;
    };

    return (
        <ReceiptScreen
            actionButtons={
                <div className={styles.actions}>
                    <Button size='lg' textSize='sm' variant='outlined'>
                        View transaction history
                    </Button>
                    <Button size='lg' textSize='sm'>
                        Make a new withdrawal
                    </Button>
                </div>
            }
            amount={`${amount} ${fromAccount?.currency}`}
            fromElement={
                <>
                    <div className={styles['account-info']}>
                        {fromAccount?.currency && (
                            <CurrencyIcon currency={fromAccount?.currency} size={isMobile ? 'sm' : 'md'} />
                        )}
                        <Text weight='bold'>{getToAccountName(fromAccount)}</Text>
                    </div>
                    <div className={styles['account-id']}>
                        <Text color='less-prominent' size={isMobile ? 'md' : 'sm'}>
                            {fromAccount?.loginid}
                        </Text>
                    </div>
                </>
            }
            title='Your funds have been transferred'
            toElement={
                <>
                    <div className={styles['account-info']}>
                        <TradingAppIcon name='DerivX' size={isMobile ? 'sm' : 'md'} />
                        <Text weight='bold'>{getToAccountName(toAccount)}</Text>
                    </div>
                    <div className={styles['account-id']} data-testid='dt_withdrawal_crypto_receipt_address'>
                        <Text color='less-prominent' size={isMobile ? 'md' : 'sm'}>
                            {toAccount.loginid}
                        </Text>
                    </div>
                </>
            }
        />
    );
};

export default TransferReceipt;
