import React from 'react';
import classNames from 'classnames';
import { ButtonLink, Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { epochToMoment } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { getStatus } from 'Constants/transaction-status';
import './recent-transaction.scss';

const RecentTransaction = observer(() => {
    const {
        client,
        modules: {
            cashier: { transaction_history },
        },
    } = useStore();

    const { currency } = client;

    const { crypto_transactions, onMount, setIsCryptoTransactionsVisible } = transaction_history;

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    if (!crypto_transactions.length) {
        return null;
    }
    let { address_hash, submit_date, transaction_type } = crypto_transactions[0];
    const { status_code, transaction_hash } = crypto_transactions[0];
    const status = getStatus(transaction_hash, transaction_type, status_code);
    submit_date = epochToMoment(submit_date).format('MMM D, YYYY');
    transaction_type = transaction_type[0].toUpperCase() + transaction_type.slice(1);
    address_hash = `${address_hash.substring(0, 4)}....${address_hash.substring(address_hash.length - 4)}`;

    const amount = crypto_transactions[0].amount;

    const onClickViewAll = () => {
        setIsCryptoTransactionsVisible(true);
    };

    return (
        <div className='recent-transaction__wrapper'>
            <div className='cashier-recent-transaction'>
                <Text weight='bold' as='p' line_height='s' size='xs'>
                    <Localize i18n_default_text='Recent transactions' />
                </Text>
                <div className='cashier-recent-transaction__data-wrapper'>
                    <Icon
                        className='cashier-recent-transaction__icon'
                        data_testid={transaction_type === 'Deposit' ? 'dti_icon_cashier_add' : 'dti_icon_cashier_minus'}
                        icon={transaction_type === 'Deposit' ? 'IcCashierAdd' : 'IcCashierMinus'}
                        size={32}
                    />
                    <div>
                        <div className='cashier-recent-transaction__status-wrapper'>
                            <Text as='p' size='xxs'>
                                <Localize
                                    i18n_default_text='{{transaction_type}} {{currency}}'
                                    values={{
                                        transaction_type,
                                        currency,
                                    }}
                                />
                            </Text>
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
                        </div>
                        <Text as='p' size='xxxs' color='less-prominent' line_height='s'>
                            <Localize
                                i18n_default_text='{{amount}} {{currency}} on {{submit_date}}'
                                values={{
                                    amount,
                                    currency,
                                    submit_date,
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
                                    {address_hash}
                                </Text>
                            </div>

                            <div className='cashier-recent-transaction__hash'>
                                <Text as='p' size='xxxs' line_height='xs'>
                                    <Localize i18n_default_text='Transaction hash:' />
                                    &nbsp;
                                </Text>
                                <Text as='p' size='xxxs' color='red' line_height='s'>
                                    {status.transaction_hash}
                                </Text>
                            </div>
                        </div>
                    </div>
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
});

export default RecentTransaction;
