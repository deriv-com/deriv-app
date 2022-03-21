import classNames from 'classnames';
import * as React from 'react';
import { Icon, Money, Text } from '@deriv/components';
import { getFormattedText } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { RequiredAndNotNull } from 'Types';
import { TStatementTransaction, TTransactionActionType } from './transactions.types';

const ActionType = ({ action_type }: { action_type: TTransactionActionType }) => {
    switch (action_type) {
        case 'deposit':
            return <Localize i18n_default_text='Deposit' />;
        case 'withdrawal':
            return <Localize i18n_default_text='Withdrawal' />;
        // case 'transfer':
        // return localize('Transfer'); TODO: Re - enable when API done.
        default:
            return <React.Fragment>{action_type}</React.Fragment>;
    }
};

type TProps = {
    transaction: RequiredAndNotNull<TStatementTransaction>;
};

const TransactionsItemTransaction: React.FC<TProps> = ({ transaction }) => {
    const { client_store } = useStores();

    return (
        <div className='dw-transactions__transaction'>
            <div className='dw-transactions__transaction-left'>
                {/* TODO: Update with wallet icon */}
                <Icon className='dw-transactions__transaction-icon' icon='IcUnknown' height='32px' width='48px' />
                <div className='dw-transactions__transaction-description'>
                    <Text as='p' color='less-prominent' size='xxs' line_height='m'>
                        <ActionType action_type={transaction.action_type} />
                    </Text>
                    <Text as='p' color='prominent' size='xxs' line_height='m' weight='bold'>
                        {/* TODO: Update below with wallet connected to current account. */}
                        <Localize i18n_default_text='Visa USD Wallet' />
                    </Text>
                </div>
            </div>
            <div className='dw-transactions__transaction-right'>
                <Text as='p' size='xs' line_height='m' weight='bold'>
                    <Money
                        amount={transaction.amount}
                        className={classNames({
                            'dw-transactions__transaction-amount--positive': transaction.amount > 0,
                            'dw-transactions__transaction-amount--negative': transaction.amount < 0,
                        })}
                        currency={client_store.currency}
                        show_currency
                    />
                </Text>
                <Text as='p' color='less-prominent' size='xxs' line_height='s'>
                    <Localize
                        i18n_default_text='Balance: {{ balance_amount }}'
                        values={{
                            balance_amount: getFormattedText(transaction.balance_after, client_store.currency),
                        }}
                    />
                </Text>
            </div>
        </div>
    );
};

export default observer(TransactionsItemTransaction);
