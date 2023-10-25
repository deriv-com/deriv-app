import React from 'react';
import { StaticUrl } from '@deriv/components';
import { useCryptoTransactions } from '@deriv/hooks';
import { Localize, localize } from '@deriv/translations';
import moment from 'moment';

const cryptoTransactionMapper = (
    transaction: NonNullable<ReturnType<typeof useCryptoTransactions>['last_transaction']>
) => {
    const is_deposit = transaction.transaction_type === 'deposit';
    const submit_date = transaction.submit_date;
    const confirmations = transaction.confirmations;
    const transaction_hash = transaction.transaction_hash;
    const address_url = transaction.address_url;
    const address_url_obscure = address_url
        ? `${address_url.substring(0, 4)}....${address_url.substring(address_url.length - 4)}`
        : localize('Pending');
    const transaction_hash_obscure = transaction_hash
        ? `${transaction_hash.substring(0, 4)}....${transaction_hash.substring(transaction_hash.length - 4)}`
        : localize('Pending');

    const deposit_status_color_mapper = {
        CONFIRMED: 'successful',
        ERROR: 'unsuccessful',
        PENDING: 'warning',
    } as const;

    const withdrawal_status_color_mapper = {
        CANCELLED: 'unsuccessful',
        ERROR: 'unsuccessful',
        LOCKED: 'warning',
        PERFORMING_BLOCKCHAIN_TXN: 'warning',
        PROCESSING: 'warning',
        REJECTED: 'unsuccessful',
        REVERTED: 'unsuccessful',
        REVERTING: 'warning',
        SENT: 'successful',
        VERIFIED: 'warning',
    } as const;

    const deposit_status_name_mapper = {
        CONFIRMED: localize('Successful'),
        ERROR: localize('Unsuccessful'),
        PENDING: localize('In process'),
    } as const;

    const deposit_status_description_mapper = {
        CONFIRMED: localize('Your deposit is successful.'),
        ERROR: localize(
            'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.'
        ),
        PENDING: localize('We’ve received your request and are waiting for more blockchain confirmations.'),
    } as const;

    const withdrawal_status_name_mapper = {
        CANCELLED: localize('Cancelled'),
        ERROR: localize('Unsuccessful'),
        LOCKED: localize('In review'),
        PERFORMING_BLOCKCHAIN_TXN: localize('In process'),
        PROCESSING: localize('In process'),
        REJECTED: localize('Unsuccessful'),
        REVERTED: localize('Unsuccessful'),
        REVERTING: localize('In process'),
        SENT: localize('Successful'),
        VERIFIED: localize('In process'),
    } as const;

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
        REVERTED: localize("Your withdrawal is unsuccessful. We've sent you an email with more information."),
        REVERTING: localize("We're processing your withdrawal."),
        SENT: localize('Your withdrawal is successful.'),
        VERIFIED: localize('We’re processing your withdrawal.'),
    } as const;

    const deposit_transaction_hash_display_mapper = {
        CONFIRMED: transaction_hash_obscure,
        ERROR: localize('NA'),
        PENDING: transaction_hash_obscure,
    } as const;

    const withdrawal_transaction_hash_display_mapper = {
        CANCELLED: localize('NA'),
        ERROR: localize('NA'),
        LOCKED: transaction_hash_obscure,
        PERFORMING_BLOCKCHAIN_TXN: transaction_hash_obscure,
        PROCESSING: transaction_hash_obscure,
        REJECTED: localize('NA'),
        REVERTED: localize('NA'),
        REVERTING: localize('NA'),
        SENT: transaction_hash_obscure,
        VERIFIED: transaction_hash_obscure,
    } as const;

    const deposit_confirmation_display_mapper = {
        CONFIRMED: localize('Confirmed'),
        ERROR: localize('NA'),
        PENDING: confirmations ? `${confirmations}` : localize('Pending'),
    } as const;

    const withdrawal_confirmation_display_mapper = {
        CANCELLED: '-',
        ERROR: '-',
        LOCKED: '-',
        PERFORMING_BLOCKCHAIN_TXN: '-',
        PROCESSING: '-',
        REJECTED: '-',
        REVERTED: '-',
        REVERTING: '-',
        SENT: '-',
        VERIFIED: '-',
    } as const;

    const status_color = is_deposit
        ? deposit_status_color_mapper[transaction.status_code]
        : withdrawal_status_color_mapper[transaction.status_code];

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

    const submit_date_display = moment
        .unix(submit_date || 0)
        .utc()
        .format('MMM D, YYYY');

    return {
        ...transaction,
        is_deposit,
        status_color,
        status_name,
        status_description,
        transaction_hash_display,
        address_url_display: address_url_obscure,
        confirmation_display,
        submit_date_display,
    } as const;
};

export default cryptoTransactionMapper;
