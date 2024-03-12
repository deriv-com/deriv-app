import React from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ProposalOpenContract } from '@deriv/api-types';
import { Button, DataList, Icon, Text, ThemedScrollbars } from '@deriv/components';
import { useNewRowTransition } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import Download from 'Components/download';
import { contract_stages } from 'Constants/contract-stage';
import { transaction_elements } from 'Constants/transactions';
import { useDBotStore } from 'Stores/useDBotStore';
import Transaction from './transaction';

type TTransactions = {
    is_drawer_open: boolean;
};

type TTransactionItem = {
    row: {
        type: string;
        data: ProposalOpenContract;
    };
    is_new_row: boolean;
};

const TransactionItem = ({ row, is_new_row }: TTransactionItem) => {
    const { in_prop } = useNewRowTransition(is_new_row);
    switch (row.type) {
        case transaction_elements.CONTRACT: {
            const { data: contract } = row;
            return (
                <CSSTransition in={in_prop} timeout={500} classNames='list__animation'>
                    <Transaction contract={contract} />
                </CSSTransition>
            );
        }
        case transaction_elements.DIVIDER: {
            return (
                <div className='transactions__divider'>
                    <div className='transactions__divider-line' />
                </div>
            );
        }
        default: {
            return null;
        }
    }
};

const Transactions = observer(({ is_drawer_open }: TTransactions) => {
    const { ui } = useStore();
    const { run_panel, transactions } = useDBotStore();
    const { contract_stage } = run_panel;
    const { transactions: transaction_list, onMount, onUnmount, toggleTransactionDetailsModal } = transactions;
    const { is_mobile } = ui;
    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    return (
        <div
            className={classnames('transactions', {
                'run-panel-tab__content': !is_mobile,
                'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
            })}
        >
            <div className='download__container transaction-details__button-container'>
                <Download tab='transactions' />
                <Button
                    id='download__container__view-detail-button'
                    className='download__container__view-detail-button'
                    is_disabled={!transaction_list?.length}
                    text={localize('View Detail')}
                    onClick={() => {
                        toggleTransactionDetailsModal(true);
                    }}
                    secondary
                    icon={<Icon icon='IcDbotViewDetail' size={18} />}
                />
            </div>
            <div className='transactions__header'>
                <span className='transactions__header-column transactions__header-type'>{localize('Type')}</span>
                <span className='transactions__header-column transactions__header-spot'>
                    {localize('Entry/Exit spot')}
                </span>
                <span className='transactions__header-column transactions__header-profit'>
                    {localize('Buy price and P/L')}
                </span>
            </div>
            <div
                className={classnames({
                    transactions__content: !is_mobile,
                    'transactions__content--mobile': is_mobile,
                })}
            >
                <div className='transactions__scrollbar'>
                    {transaction_list?.length ? (
                        <DataList
                            className='transactions'
                            data_source={transaction_list}
                            rowRenderer={props => <TransactionItem {...props} />}
                            keyMapper={row => {
                                switch (row.type) {
                                    case transaction_elements.CONTRACT: {
                                        return row.data.transaction_ids.buy;
                                    }
                                    case transaction_elements.DIVIDER: {
                                        return row.data;
                                    }
                                    default: {
                                        return null;
                                    }
                                }
                            }}
                            getRowSize={({ index }) => {
                                const row = transaction_list?.[index];
                                switch (row.type) {
                                    case transaction_elements.CONTRACT: {
                                        return 50;
                                    }
                                    case transaction_elements.DIVIDER: {
                                        return 21;
                                    }
                                    default: {
                                        return 0;
                                    }
                                }
                            }}
                        />
                    ) : (
                        <>
                            {contract_stage >= contract_stages.STARTING ? (
                                <Transaction contract={null} />
                            ) : (
                                <ThemedScrollbars>
                                    <div className='transactions-empty-box'>
                                        <div className='transactions-empty'>
                                            <div className='transactions-empty__icon-box'>
                                                <Icon
                                                    icon='IcBox'
                                                    className='transactions-empty__icon'
                                                    size={64}
                                                    color='secondary'
                                                />
                                            </div>
                                            <Text
                                                as='h4'
                                                size='xs'
                                                weight='bold'
                                                align='center'
                                                color='less-prominent'
                                                line_height='xxs'
                                                className='transactions-empty__header'
                                            >
                                                {localize('There are no transactions to display')}
                                            </Text>
                                            <div className='transactions-empty__message'>
                                                <Text size='xxs' color='less-prominent'>
                                                    {localize('Here are the possible reasons:')}
                                                </Text>
                                                <ul className='transactions-empty__list'>
                                                    <li>{localize('The bot is not running')}</li>
                                                    <li>{localize('The stats are cleared')}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </ThemedScrollbars>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default Transactions;
