import React, { useCallback } from 'react';
import { Button, Loading, SideNote, Text } from '@deriv/components';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import classNames from 'classnames';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { cryptoTransactionMapper } from '../../helpers';
import './crypto-transactions-side-note-recent-transaction.scss';

const CryptoTransactionsSideNoteRecentTransaction: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { transaction_history } = useCashierStore();
    const { setIsCryptoTransactionsVisible } = transaction_history;
    const { last_transaction, has_transactions, is_loading, error, subscribe } = useCryptoTransactions();
    const currency_config = useCurrentCurrencyConfig();

    const TransactionDetail = useCallback(() => {
        if (!last_transaction) return null;

        const {
            is_deposit,
            status_color,
            status_name,
            amount,
            submit_date_display,
            address_url_display,
            confirmation_display,
            transaction_hash_display,
        } = cryptoTransactionMapper(last_transaction);

        return (
            <>
                <div className='crypto-transactions-side-note-recent-transaction__content'>
                    <Text size={'xxs'}>
                        {is_deposit
                            ? localize('Deposit {{currency}}', { currency: currency_config.display_code })
                            : localize('Withdrawal {{currency}}', { currency: currency_config.display_code })}
                    </Text>
                    <Text
                        size={'xxxs'}
                        color={'less-prominent'}
                        className='crypto-transactions-side-note-recent-transaction__date'
                    >
                        {localize('{{amount}} {{currency}} on {{date}}', {
                            amount,
                            currency: currency_config.display_code,
                            date: submit_date_display,
                        })}
                    </Text>
                    <Text size={'xxxs'}>
                        <Localize
                            i18n_default_text='Address: <0>{{value}}</0>'
                            values={{ value: address_url_display }}
                            components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                        />
                    </Text>
                    <Text size={'xxxs'}>
                        <Localize
                            i18n_default_text='Transaction hash: <0>{{value}}</0>'
                            values={{ value: transaction_hash_display }}
                            components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                        />
                    </Text>
                    {is_deposit && (
                        <Text size={'xxxs'}>
                            <Localize
                                i18n_default_text='Confirmations: <0>{{value}}</0>'
                                values={{ value: confirmation_display }}
                                components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                            />
                        </Text>
                    )}
                    <div className='crypto-transactions-side-note-recent-transaction__status'>
                        <div
                            className={classNames(
                                'crypto-transactions-side-note-recent-transaction__status-dot',
                                `crypto-transactions-side-note-recent-transaction__status-dot-${status_color}`
                            )}
                        />
                        <Text size={'xxxs'}>{status_name}</Text>
                    </div>
                </div>
                <div className='crypto-transactions-side-note-recent-transaction__divider' />
                <Button
                    text={localize('View more')}
                    onClick={() => setIsCryptoTransactionsVisible(true)}
                    secondary
                    small
                    className='crypto-transactions-side-note-recent-transaction__button'
                />
            </>
        );
    }, [currency_config.display_code, last_transaction, setIsCryptoTransactionsVisible]);

    const LoadingState = useCallback(() => <Loading is_fullscreen={false} />, []);

    const ErrorState = useCallback(
        () => (
            <>
                <Text size={is_mobile ? 'xxs' : 'xs'}>
                    {localize('Unfortunately, we cannot retrieve the information at this time. ')}
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

    const NoTransactionState = useCallback(
        () => (
            <>
                <Text size={is_mobile ? 'xxs' : 'xs'}>{localize('No recent transactions.')}</Text>
                <div className='crypto-transactions-side-note-recent-transaction__divider' />
            </>
        ),
        [is_mobile]
    );

    return (
        <SideNote type={error ? 'warning' : undefined} title={localize('Transaction status')}>
            <div className='crypto-transactions-side-note-recent-transaction'>
                <div className='crypto-transactions-side-note-recent-transaction__divider' />
                {is_loading && <LoadingState />}
                {!is_loading && !error && has_transactions && <TransactionDetail />}
                {!is_loading && !error && !has_transactions && <NoTransactionState />}
                {error ? <ErrorState /> : <></>}
            </div>
        </SideNote>
    );
});

export default CryptoTransactionsSideNoteRecentTransaction;
