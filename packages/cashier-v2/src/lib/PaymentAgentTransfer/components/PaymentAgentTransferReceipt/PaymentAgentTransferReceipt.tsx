import React from 'react';
import { useHistory } from 'react-router-dom';
import { DerivLightPaymentAgentIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import BackArrow from '../../../../assets/images/back-arrow.svg';
import { CurrencyIcon } from '../../../../components/CurrencyIcon';
import type { TActiveAccount, TPaymentAgentTransfer } from '../../types';
import styles from './PaymentAgentTransferReceipt.module.scss';

type TProps = {
    activeAccount?: TActiveAccount;
    resetPaymentAgentTransfer: TPaymentAgentTransfer['resetPaymentAgentTransfer'];
    transferReceipt: TPaymentAgentTransfer['transferReceipt'];
};

const PaymentAgentTransferReceipt: React.FC<TProps> = ({
    activeAccount,
    resetPaymentAgentTransfer,
    transferReceipt,
}) => {
    const { amount, clientID, clientName, currency } = transferReceipt;
    const formattedTransferredAmount = `${FormatUtils.formatMoney(Number(amount), { currency })} ${currency}`;
    const history = useHistory();

    const onViewTransactionsHandler = () => {
        history.push('/reports/statement');
        resetPaymentAgentTransfer();
    };

    //TODO: implement platform check in cashier-v2
    const isFromDerivgo = false;

    return (
        <div className={styles.container}>
            <div>
                <Text align='center' as='p' className={styles.title} size='md' weight='bold'>
                    {`You've transferred ${formattedTransferredAmount}`}
                </Text>
                <div className={styles['details-container']}>
                    <div className={styles['detail-wrapper']}>
                        <div className={styles['detail-info']}>
                            <Text size='sm' weight='bold'>
                                {activeAccount?.currency_config?.name}
                            </Text>
                            <Text color='primary' size='sm'>
                                {activeAccount?.loginid}
                            </Text>
                        </div>
                        <CurrencyIcon currency={currency} size='md' />
                    </div>
                    <BackArrow className={styles['arrow-icon']} />
                    <div className={styles['detail-wrapper']}>
                        <DerivLightPaymentAgentIcon height={32} width={32} />
                        <div className={styles['detail-info']}>
                            <Text size='sm' weight='bold'>
                                {clientName}
                            </Text>
                            <Text color='primary' size='sm'>
                                {clientID}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['buttons-container']}>
                {!isFromDerivgo && (
                    <Button onClick={onViewTransactionsHandler} size='lg' variant='outlined'>
                        View transactions
                    </Button>
                )}
                <Button onClick={resetPaymentAgentTransfer} size='lg'>
                    Make a new transfer
                </Button>
            </div>
        </div>
    );
};

export default PaymentAgentTransferReceipt;
