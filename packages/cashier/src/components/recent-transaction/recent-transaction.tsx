import React from 'react';
import classNames from 'classnames';
import { ButtonLink, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { epochToMoment } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { getStatus } from '../../constants/transaction-status';
import { useCashierStore } from '../../stores/useCashierStores';
import './recent-transaction.scss';

const RecentTransaction = observer(() => {
    const { client } = useStore();
    const { currency } = client;
    const { transaction_history } = useCashierStore();
    const { crypto_transactions, onMount, setIsCryptoTransactionsVisible } = transaction_history;

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const onClickViewAll = () => {
        setIsCryptoTransactionsVisible(true);
    };

    const SideNoteContainer = ({ children }: React.PropsWithChildren<unknown>) => (
        <div className='recent-transaction__wrapper'>
            <div className='cashier-recent-transaction'>
                <Text weight='bold' as='p' line_height='s' size='xs'>
                    <Localize i18n_default_text='Recent transactions' />
                </Text>
                <div className='cashier-recent-transaction__data-wrapper'>
                    <div>{children}</div>
                </div>
                <ButtonLink
                    to='#'
                    className='dc-btn--secondary cashier-recent-transaction__view-all-button'
                    onClick={onClickViewAll}
                >
                    <Text weight='bold' as='p' size='xxs'>
                        <Localize i18n_default_text='View all' />
                    </Text>
                </ButtonLink>
            </div>
        </div>
    );

    if (!crypto_transactions.length) {
        return (
            <SideNoteContainer>
                <Text as='p' line_height='s' size='xs'>
                    <Localize i18n_default_text='No recent transactions.' />
                </Text>
            </SideNoteContainer>
        );
    }

    const { address_hash, transaction_hash, transaction_type, status_code, submit_date, confirmations } =
        crypto_transactions[0];
    const status = getStatus(transaction_hash, transaction_type, status_code, confirmations);
    const submit_date_moment = epochToMoment(submit_date).format('MMM D, YYYY');
    const transaction_type_display_text = transaction_type[0].toUpperCase() + transaction_type.slice(1);
    const address_hash_display_value = `${address_hash.substring(0, 4)}....${address_hash.substring(
        address_hash.length - 4
    )}`;

    const amount = crypto_transactions[0].amount;

    return (
        <SideNoteContainer>
            <div className='cashier-recent-transaction__status-wrapper'>
                <Text as='p' size='xxs'>
                    <Localize
                        i18n_default_text='{{transaction_type_display_text}} {{currency}}'
                        values={{
                            transaction_type_display_text,
                            currency,
                        }}
                    />
                </Text>
                {status && (
                    <div className='cashier-recent-transaction__status'>
                        <span
                            className={classNames(
                                'cashier-recent-transaction__status-indicator',
                                `cashier-recent-transaction__status-indicator-${status.renderer}`
                            )}
                        />
                        <Text as='p' size='xxxs'>
                            {status.name}
                        </Text>
                    </div>
                )}
            </div>
            <Text as='p' size='xxxs' color='less-prominent' line_height='s'>
                <Localize
                    i18n_default_text='{{amount}} {{currency}} on {{submit_date_moment}}'
                    values={{
                        amount,
                        currency,
                        submit_date_moment,
                    }}
                />
            </Text>
            <div className='cashier-recent-transaction__hash-wrapper'>
                <div className='cashier-recent-transaction__hash'>
                    <Text as='p' size='xxxs' line_height='s'>
                        <Localize i18n_default_text='Address:' />
                        &nbsp;
                    </Text>
                    <Text as='p' size='xxxs' color='red' line_height='s'>
                        {address_hash_display_value}
                    </Text>
                </div>

                <div className='cashier-recent-transaction__hash'>
                    <Text as='p' size='xxxs' line_height='xs'>
                        <Localize i18n_default_text='Transaction hash:' />
                        &nbsp;
                    </Text>
                    {status && (
                        <Text as='p' size='xxxs' color='red' line_height='s'>
                            {status.transaction_hash}
                        </Text>
                    )}
                </div>
                {transaction_type === 'deposit' && (
                    <div className='cashier-recent-transaction__hash'>
                        <Text as='p' size='xxxs' line_height='xs'>
                            <Localize i18n_default_text='Confirmations:' />
                            &nbsp;
                        </Text>
                        <Text as='p' size='xxxs' color='red' line_height='s'>
                            {status?.confirmation_label}
                        </Text>
                    </div>
                )}
            </div>
        </SideNoteContainer>
    );
});

export default RecentTransaction;
