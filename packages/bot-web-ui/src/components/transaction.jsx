import classNames from 'classnames';
import { Icon, Money, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';
import { getContractTypeName } from '@deriv/bot-skeleton';
import IconTradeType from './icon-trade-types.jsx';
import { connect } from '../stores/connect';
import { popover_zindex } from '../constants/z-indexes';

const TransactionIconWithText = ({ icon, title, message, className }) => (
    <React.Fragment>
        <Popover
            className={classNames(className, 'transactions__icon')}
            alignment='left'
            message={title}
            zIndex={popover_zindex.TRANSACTION}
        >
            {icon}
        </Popover>
        {message}
    </React.Fragment>
);

const TransactionFieldLoader = () => (
    <ContentLoader
        className='transactions__loader-text'
        height={10}
        width={80}
        speed={3}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='0' ry='0' width='100' height='12' />
    </ContentLoader>
);

const TransactionIconLoader = () => (
    <ContentLoader
        className='transactions__loader-icon'
        speed={3}
        width={30}
        height={30}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='5' ry='5' width='30' height='30' />
    </ContentLoader>
);

const PopoverItem = ({ icon, title, children }) => (
    <div className='transactions__popover-item'>
        {icon && <div className='transaction__popover-icon'>{icon}</div>}
        <div className='transactions__popover-details'>
            <div className='transactions__popover-title'>{title}</div>
            {children}
        </div>
    </div>
);

const PopoverContent = ({ contract }) => (
    <div className='transactions__popover-content'>
        {contract.transaction_ids && (
            <PopoverItem title={localize('Reference IDs')}>
                {contract.transaction_ids.buy && (
                    <div className='transactions__popover-value'>
                        {`${contract.transaction_ids.buy} ${localize('(Buy)')}`}
                    </div>
                )}
                {contract.transaction_ids.sell && (
                    <div className='transactions__popover-value'>
                        {`${contract.transaction_ids.sell} ${localize('(Sell)')}`}
                    </div>
                )}
            </PopoverItem>
        )}
        {contract.tick_count && (
            <PopoverItem title={localize('Duration')}>
                <div className='transactions__popover-value'>{`${contract.tick_count} ${localize('ticks')}`}</div>
            </PopoverItem>
        )}
        {(contract.barrier && (
            <PopoverItem title={localize('Barrier')}>
                <div className='transactions__popover-value'>{contract.barrier}</div>
            </PopoverItem>
        )) ||
            (contract.high_barrier && contract.low_barrier && (
                <PopoverItem title={localize('Barriers')}>
                    <div className='transactions__popover-value'>{`${contract.high_barrier} ${localize(
                        '(High)'
                    )}`}</div>
                    <div className='transactions__popover-value'>{`${contract.low_barrier} ${localize('(Low)')}`}</div>
                </PopoverItem>
            ))}
        {contract.date_start && (
            <PopoverItem title={localize('Start time')}>
                <div className='transactions__popover-value'>{contract.date_start}</div>
            </PopoverItem>
        )}
        {contract.entry_tick && (
            <PopoverItem title={localize('Entry spot')}>
                <div className='transactions__popover-value'>{contract.entry_tick}</div>
                {contract.entry_tick_time && (
                    <div className='transactions__popover-value'>{contract.entry_tick_time}</div>
                )}
            </PopoverItem>
        )
        // TODO: Durations for non-tick contracts, requires helpers from Trader.
        }
        {(contract.exit_tick && contract.exit_tick_time && (
            <PopoverItem title={localize('Exit spot')}>
                <div className='transactions__popover-value'>{contract.exit_tick}</div>
                <div className='transactions__popover-value'>{contract.exit_tick_time}</div>
            </PopoverItem>
        )) ||
            (contract.exit_tick && (
                <PopoverItem title={localize('Exit time')}>
                    <div className='transactions__popover-value'>{contract.exit_tick}</div>
                </PopoverItem>
            ))}
    </div>
);

const Transaction = ({ active_transaction_id, contract, setActiveTransactionId }) => (
    <Popover
        zIndex={popover_zindex.TRANSACTION}
        alignment='left'
        className='transactions__item-wrapper'
        is_open={contract && active_transaction_id === contract.transaction_ids.buy}
        message={contract && <PopoverContent contract={contract} />}
    >
        <div
            className='transactions__item'
            onClick={contract && (() => setActiveTransactionId(contract.transaction_ids.buy))}
        >
            {/* TODO: Re-enable when <Icon> is shared.
        <div className='transactions__cell transactions__symbol'>
            <TransactionIconWithText
                icon={<UnderlyingIcon market={contract.underlying} />}
                title={contract.display_name}
            />
        </div> */}
            <div className='transactions__cell transactions__trade-type'>
                {contract ? (
                    <TransactionIconWithText
                        icon={<IconTradeType type={contract.contract_type} />}
                        title={getContractTypeName(contract)}
                    />
                ) : (
                    <TransactionIconLoader />
                )}
            </div>
            <div className='transactions__cell transactions__entry-spot'>
                <TransactionIconWithText
                    icon={<Icon icon='IcContractEntrySpot' />}
                    title={localize('Entry spot')}
                    message={(contract && contract.entry_tick) || <TransactionFieldLoader />}
                />
            </div>
            <div className='transactions__cell transactions__exit-spot'>
                <TransactionIconWithText
                    icon={<Icon icon='IcContractExitSpot' />}
                    title={localize('Exit spot')}
                    message={(contract && contract.exit_tick) || <TransactionFieldLoader />}
                />
            </div>
            <div className='transactions__cell transactions__stake'>
                <TransactionIconWithText
                    icon={<Icon icon='IcContractBuyPrice' />}
                    title={localize('Buy price')}
                    message={
                        contract ? (
                            <Money amount={contract.buy_price} currency={contract.currency} />
                        ) : (
                            <TransactionFieldLoader />
                        )
                    }
                />
            </div>
            <div className='transactions__cell transactions__profit'>
                {contract && contract.profit ? (
                    <div
                        className={classNames({
                            'transactions__profit--win': contract.profit > 0,
                            'transactions__profit--loss': contract.profit < 0,
                        })}
                    >
                        <Money amount={Math.abs(contract.profit)} currency={contract.currency} />
                    </div>
                ) : (
                    <TransactionFieldLoader />
                )}
            </div>
        </div>
    </Popover>
);

Transaction.propTypes = {
    active_transaction_id: PropTypes.number,
    contract: PropTypes.object,
    setActiveTransactionId: PropTypes.func,
};

export default connect(({ transactions, run_panel }) => ({
    contract_stage: run_panel.contract_stage,
    active_transaction_id: transactions.active_transaction_id,
    setActiveTransactionId: transactions.setActiveTransactionId,
}))(Transaction);
