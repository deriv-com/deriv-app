import classnames from 'classnames';
import { Icon, DesktopWrapper, DataList, ThemedScrollbars, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useNewRowTransition, isMobile } from '@deriv/shared';
import { PropTypes } from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Download from 'Components/download';
import { contract_stages } from 'Constants/contract-stage';
import { transaction_elements } from 'Constants/transactions';
import { connect } from 'Stores/connect';
import Transaction from './transaction.jsx';

const TransactionItem = ({ row, is_new_row }) => {
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

const Transactions = ({ contract_stage, elements, is_drawer_open, onMount, onUnmount }) => {
    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    const is_mobile = isMobile();

    return (
        <div
            className={classnames('transactions', {
                'run-panel-tab__content': !is_mobile,
                'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
            })}
        >
            <DesktopWrapper>
                <div className='download__container'>
                    <Download tab='transactions' />
                </div>
            </DesktopWrapper>
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
                    {elements.length ? (
                        <DataList
                            className='transactions'
                            data_source={elements}
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
                                const row = elements[index];
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
};

Transactions.propTypes = {
    contract_stage: PropTypes.number,
    elements: PropTypes.array,
    is_drawer_open: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
};

export default connect(({ transactions, run_panel }) => ({
    contract_stage: run_panel.contract_stage,
    elements: transactions.elements,
    onMount: transactions.onMount,
    onUnmount: transactions.onUnmount,
}))(Transactions);
