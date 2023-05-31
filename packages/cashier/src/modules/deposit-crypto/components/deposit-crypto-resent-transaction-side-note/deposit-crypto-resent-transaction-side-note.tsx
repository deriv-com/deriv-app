import React from 'react';
import { useFetch } from '@deriv/api';
import { Button, Loading, SideNote, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import './deposit-crypto-resent-transaction-side-note.scss';

const DepositCryptoResentTransactionSideNote: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { transaction_history } = useCashierStore();
    const { setIsCryptoTransactionsVisible } = transaction_history;
    const { data, isLoading, error } = useFetch('cashier_payments');

    const transactions = data?.cashier_payments?.crypto;
    const has_transaction = transactions?.length > 0;
    const reset_transactions = has_transaction ? transactions?.[0] : undefined;

    return (
        <SideNote>
            <div className='deposit-crypto-resent-transaction-side-note'>
                <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                    {localize('BTC recent transactions')}
                </Text>
                <div className='deposit-crypto-resent-transaction-side-note__divider' />
                {isLoading && <Loading is_fullscreen={false} />}
                {!isLoading && !has_transaction && (
                    <Text size={is_mobile ? 'xxs' : 'xs'}>{localize('No recent transactions.')}</Text>
                )}
                <div className='deposit-crypto-resent-transaction-side-note__divider' />
                <Button
                    text={localize('View all')}
                    onClick={() => setIsCryptoTransactionsVisible(true)}
                    secondary
                    small
                    className='deposit-crypto-resent-transaction-side-note__button'
                />
            </div>
        </SideNote>
    );
});

export default DepositCryptoResentTransactionSideNote;
