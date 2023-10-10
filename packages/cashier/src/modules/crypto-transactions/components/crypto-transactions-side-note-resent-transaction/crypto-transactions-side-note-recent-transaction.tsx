import React from 'react';
import { Button, Loading, SideNote, Text } from '@deriv/components';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { cryptoTransactionMapper } from '../../helpers';
import { CryptoTransaction } from '../crypto-transaction';
import './crypto-transactions-side-note-recent-transaction.scss';

type TCryptoTransactionsSideNoteRecentTransaction = {
    transaction_type?: 'deposit' | 'withdrawal';
};

const CryptoTransactionsSideNoteRecentTransaction = observer(
    ({ transaction_type }: TCryptoTransactionsSideNoteRecentTransaction) => {
        const { ui } = useStore();
        const { is_mobile } = ui;
        const { transaction_history } = useCashierStore();
        const { setIsCryptoTransactionsVisible } = transaction_history;
        const { data: transactions, isLoading, error, subscribe } = useCryptoTransactions();
        const currency_config = useCurrentCurrencyConfig();

        const NoTransactionState = React.useCallback(
            () => (
                <>
                    <Text size={is_mobile ? 'xxs' : 'xs'}>
                        <Localize i18n_default_text='No recent transactions.' />
                    </Text>
                    <div className='crypto-transactions-side-note-recent-transaction__divider' />
                </>
            ),
            [is_mobile]
        );

        const TransactionDetail = React.useCallback(() => {
            const filtered_transactions =
                transactions?.filter(el => (transaction_type === 'deposit' ? el.is_deposit : el.is_withdrawal)) || [];

            return (
                <React.Fragment>
                    {filtered_transactions?.length === 0 ? (
                        <NoTransactionState />
                    ) : (
                        filtered_transactions?.slice(0, 3).map((transaction, index) => (
                            <React.Fragment key={transaction.id}>
                                <CryptoTransaction
                                    transaction={cryptoTransactionMapper(transaction)}
                                    currency_display_code={currency_config.display_code}
                                />
                                <div
                                    className={
                                        index < filtered_transactions.length - 1 && index < 2
                                            ? 'crypto-transactions-side-note-recent-transaction__divider__light'
                                            : 'crypto-transactions-side-note-recent-transaction__divider'
                                    }
                                />
                            </React.Fragment>
                        ))
                    )}
                    {filtered_transactions.length > 3 && (
                        <Button
                            text={localize('View more')}
                            onClick={() => setIsCryptoTransactionsVisible(true)}
                            secondary
                            small
                            className='crypto-transactions-side-note-recent-transaction__button'
                        />
                    )}
                </React.Fragment>
            );
        }, [NoTransactionState, currency_config, setIsCryptoTransactionsVisible, transaction_type, transactions]);

        const ErrorState = React.useCallback(
            () => (
                <>
                    <Text size={is_mobile ? 'xxs' : 'xs'}>
                        <Localize i18n_default_text='Unfortunately, we cannot retrieve the information at this time. ' />
                    </Text>
                    <div className='crypto-transactions-side-note-recent-transaction__divider' />
                    <Button
                        text={localize('Refresh')}
                        onClick={() => subscribe()}
                        secondary
                        small
                        className='crypto-transactions-side-note-recent-transaction__button'
                    />
                </>
            ),
            [is_mobile, subscribe]
        );

        return (
            <SideNote type={error ? 'warning' : undefined} title={localize('Transaction status')}>
                <div className='crypto-transactions-side-note-recent-transaction'>
                    <div className='crypto-transactions-side-note-recent-transaction__divider' />
                    {isLoading && <Loading is_fullscreen={false} />}
                    {!isLoading && !error && <TransactionDetail />}
                    {!!error && <ErrorState />}
                </div>
            </SideNote>
        );
    }
);

export default CryptoTransactionsSideNoteRecentTransaction;
