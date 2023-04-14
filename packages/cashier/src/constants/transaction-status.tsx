import React from 'react';
import { StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { TStatusCode, TTransactionType } from '../types';

export const getStatus = (transaction_hash: string, transaction_type: TTransactionType, status_code: TStatusCode) => {
    const formatted_transaction_hash = transaction_hash
        ? `${transaction_hash.substring(0, 4)}....${transaction_hash.substring(transaction_hash.length - 4)}`
        : localize('Pending');
    const status_list = {
        deposit: {
            CONFIRMED: {
                name: localize('Successful'),
                description: localize('Your deposit is successful.'),
                renderer: 'successful',
                transaction_hash: formatted_transaction_hash,
            },
            ERROR: {
                name: localize('Unsuccessful'),
                description: localize(
                    'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.'
                ),
                renderer: 'unsuccessful',
                transaction_hash: localize('NA'),
            },
            PENDING: {
                name: localize('In process'),
                description: localize('We’ve received your request and are waiting for more blockchain confirmations.'),
                renderer: 'in-process',
                transaction_hash: formatted_transaction_hash,
            },
        },
        withdrawal: {
            CANCELLED: {
                name: localize('Cancelled'),
                description: localize('You’ve cancelled your withdrawal request.'),
                renderer: 'unsuccessful',
                transaction_hash: localize('NA'),
            },
            ERROR: {
                name: localize('Unsuccessful'),
                description: (
                    <Localize
                        key={0}
                        i18n_default_text='Your withdrawal is unsuccessful due to an error on the blockchain. Please <0>contact us</0> via live chat for more info.'
                        values={{
                            interpolation: { escapeValue: false },
                        }}
                        components={[<StaticUrl key={0} className='link' href='contact-us/?is_livechat_open=true' />]}
                    />
                ),
                renderer: 'unsuccessful',
                transaction_hash: localize('NA'),
            },
            LOCKED: {
                name: localize('In review'),
                description: localize(
                    "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel."
                ),
                renderer: 'in-review',
                transaction_hash: formatted_transaction_hash,
            },
            PERFORMING_BLOCKCHAIN_TXN: {
                name: localize('In process'),
                description: localize('We’re sending your request to the blockchain.'),
                renderer: 'in-process',
                transaction_hash: formatted_transaction_hash,
            },
            PROCESSING: {
                name: localize('In process'),
                description: localize('We’re awaiting confirmation from the blockchain.'),
                renderer: 'in-process',
                transaction_hash: formatted_transaction_hash,
            },
            REJECTED: {
                name: localize('Unsuccessful'),
                description: localize(
                    "Your withdrawal is unsuccessful. We've sent you an email with more information."
                ),
                renderer: 'unsuccessful',
                transaction_hash: localize('NA'),
            },
            SENT: {
                name: localize('Successful'),
                description: localize('Your withdrawal is successful.'),
                renderer: 'successful',
                transaction_hash: formatted_transaction_hash,
            },
            VERIFIED: {
                name: localize('In process'),
                description: localize('We’re processing your withdrawal.'),
                renderer: 'in-process',
                transaction_hash: formatted_transaction_hash,
            },
        },
    };

    const isDeposit = (status: TStatusCode): status is keyof typeof status_list.deposit =>
        Object.keys(status_list.deposit).includes(status);
    const isWithdrawal = (status: TStatusCode): status is keyof typeof status_list.withdrawal =>
        Object.keys(status_list.withdrawal).includes(status);

    if (transaction_type === 'deposit' && isDeposit(status_code)) {
        return status_list[transaction_type][status_code];
    } else if (transaction_type === 'withdrawal' && isWithdrawal(status_code)) {
        return status_list[transaction_type][status_code];
    }

    return null;
};
