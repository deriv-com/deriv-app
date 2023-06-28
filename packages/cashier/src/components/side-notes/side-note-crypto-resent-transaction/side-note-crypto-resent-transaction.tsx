import React, { useCallback } from 'react';
import { Button, Loading, SideNote, StaticUrl, Text } from '@deriv/components';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';
import { epochToMoment } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useCashierStore } from '../../../stores/useCashierStores';
import './side-note-crypto-resent-transaction.scss';

const SideNoteCryptoRecentTransaction: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { transaction_history } = useCashierStore();
    const { setIsCryptoTransactionsVisible } = transaction_history;
    const { last_transactions, has_transactions, isLoading, error, refetch } = useCryptoTransactions();
    const currency_config = useCurrentCurrencyConfig();

    const TransactionDetail = useCallback(() => {
        if (!last_transactions) return null;

        const transactions = transaction_mapper(last_transactions);
        const {
            is_deposit,
            amount,
            submit_date_display,
            address_url_display,
            confirmation_display,
            transaction_hash_display,
        } = transactions;

        return (
            <>
                <div className='deposit-crypto-recent-transaction-side-note__content'>
                    <Text size={'xxs'}>
                        {is_deposit
                            ? localize('Deposit {{currency}}', { currency: currency_config.display_code })
                            : localize('Withdrawal {{currency}}', { currency: currency_config.display_code })}
                    </Text>
                    <Text
                        size={'xxxs'}
                        color={'less-prominent'}
                        className='deposit-crypto-recent-transaction-side-note__date'
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
                    <Text size={'xxxs'}>
                        <Localize
                            i18n_default_text='Confirmations: <0>{{value}}</0>'
                            values={{ value: confirmation_display }}
                            components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                        />
                    </Text>
                </div>
                <div className='deposit-crypto-recent-transaction-side-note__divider' />
                <Button
                    text={localize('View more')}
                    onClick={() => setIsCryptoTransactionsVisible(true)}
                    secondary
                    small
                    className='deposit-crypto-recent-transaction-side-note__button'
                />
            </>
        );
    }, [currency_config.display_code, last_transactions, setIsCryptoTransactionsVisible]);

    const LoadingState = useCallback(() => <Loading is_fullscreen={false} />, []);

    const ErrorState = useCallback(
        () => (
            <>
                <Text size={is_mobile ? 'xxs' : 'xs'}>
                    {localize('Unfortunately, we cannot retrieve the information at this time. ')}
                </Text>
                <div className='deposit-crypto-recent-transaction-side-note__divider' />
                <Button
                    text={localize('Refresh')}
                    onClick={() => refetch()}
                    secondary
                    small
                    className='deposit-crypto-recent-transaction-side-note__button'
                />
            </>
        ),
        [is_mobile, refetch]
    );

    const NoTransactionState = useCallback(
        () => (
            <>
                <Text size={is_mobile ? 'xxs' : 'xs'}>{localize('No recent transactions.')}</Text>
                <div className='deposit-crypto-recent-transaction-side-note__divider' />
            </>
        ),
        [is_mobile]
    );

    return (
        <SideNote>
            <div className='deposit-crypto-recent-transaction-side-note'>
                <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                    {localize('Transaction status')}
                </Text>
                <div className='deposit-crypto-recent-transaction-side-note__divider' />
                {isLoading && <LoadingState />}
                {!isLoading && !error && has_transactions && <TransactionDetail />}
                {!isLoading && !error && !has_transactions && <NoTransactionState />}
                {error ? <ErrorState /> : <></>}
            </div>
        </SideNote>
    );
});

export default SideNoteCryptoRecentTransaction;

const transaction_mapper = (
    transaction: NonNullable<ReturnType<typeof useCryptoTransactions>['last_transactions']>
) => {
    const is_deposit = transaction?.transaction_type === 'deposit';
    const submit_date = transaction?.submit_date;
    const confirmations = transaction?.confirmations;
    const transaction_hash = transaction?.transaction_hash;
    const address_url = transaction?.address_url;
    const address_url_obscure = address_url
        ? `${address_url.substring(0, 4)}....${address_url.substring(address_url.length - 4)}`
        : localize('Pending');
    const transaction_hash_obscure = transaction_hash
        ? `${transaction_hash.substring(0, 4)}....${transaction_hash.substring(transaction_hash.length - 4)}`
        : localize('Pending');

    const deposit_status_name_mapper = {
        CONFIRMED: localize('Successful'),
        ERROR: localize('Unsuccessful'),
        PENDING: localize('In process'),
    };

    const deposit_status_description_mapper = {
        CONFIRMED: localize('Your deposit is successful.'),
        ERROR: localize(
            'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.'
        ),
        PENDING: localize('We’ve received your request and are waiting for more blockchain confirmations.'),
    };

    const withdrawal_status_name_mapper = {
        CANCELLED: localize('Cancelled'),
        ERROR: localize('Unsuccessful'),
        LOCKED: localize('In review'),
        PERFORMING_BLOCKCHAIN_TXN: localize('In process'),
        PROCESSING: localize('In process'),
        REJECTED: localize('Unsuccessful'),
        SENT: localize('Successful'),
        VERIFIED: localize('In process'),
    };

    const withdrawal_status_description_mapper = {
        CANCELLED: localize('You’ve cancelled your withdrawal request.'),
        ERROR: (
            <Localize
                key={0}
                i18n_default_text='Your withdrawal is unsuccessful due to an error on the blockchain. Please <0>contact us</0> via live chat for more info.'
                values={{
                    interpolation: { escapeValue: false },
                }}
                components={[<StaticUrl key={0} className='link' href='contact-us/?is_livechat_open=true' />]}
            />
        ),
        LOCKED: localize(
            "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel."
        ),
        PERFORMING_BLOCKCHAIN_TXN: localize('We’re sending your request to the blockchain.'),
        PROCESSING: localize('We’re awaiting confirmation from the blockchain.'),
        REJECTED: localize("Your withdrawal is unsuccessful. We've sent you an email with more information."),
        SENT: localize('Your withdrawal is successful.'),
        VERIFIED: localize('We’re processing your withdrawal.'),
    };

    const deposit_transaction_hash_display_mapper = {
        CONFIRMED: transaction_hash_obscure,
        ERROR: localize('NA'),
        PENDING: transaction_hash_obscure,
    };

    const withdrawal_transaction_hash_display_mapper = {
        CANCELLED: localize('NA'),
        ERROR: localize('NA'),
        LOCKED: transaction_hash_obscure,
        PERFORMING_BLOCKCHAIN_TXN: transaction_hash_obscure,
        PROCESSING: transaction_hash_obscure,
        REJECTED: localize('NA'),
        SENT: transaction_hash_obscure,
        VERIFIED: transaction_hash_obscure,
    };

    const deposit_confirmation_display_mapper = {
        CONFIRMED: localize('Confirmed'),
        ERROR: localize('NA'),
        PENDING: confirmations ? `${confirmations}` : localize('Pending'),
    };

    const withdrawal_confirmation_display_mapper = {
        CANCELLED: '-',
        ERROR: '-',
        LOCKED: '-',
        PERFORMING_BLOCKCHAIN_TXN: '-',
        PROCESSING: '-',
        REJECTED: '-',
        SENT: '-',
        VERIFIED: '-',
    };

    const status_name = is_deposit
        ? deposit_status_name_mapper[transaction.status_code]
        : withdrawal_status_name_mapper[transaction.status_code];

    const status_description = is_deposit
        ? deposit_status_description_mapper[transaction.status_code]
        : withdrawal_status_description_mapper[transaction.status_code];

    const transaction_hash_display = is_deposit
        ? deposit_transaction_hash_display_mapper[transaction.status_code]
        : withdrawal_transaction_hash_display_mapper[transaction.status_code];

    const confirmation_display = is_deposit
        ? deposit_confirmation_display_mapper[transaction.status_code]
        : withdrawal_confirmation_display_mapper[transaction.status_code];

    const submit_date_display = epochToMoment(submit_date || 0).format('MMM D, YYYY');

    return {
        ...transaction,
        is_deposit,
        status_name,
        status_description,
        transaction_hash_display,
        address_url_display: address_url_obscure,
        confirmation_display,
        submit_date_display,
    } as const;
};
