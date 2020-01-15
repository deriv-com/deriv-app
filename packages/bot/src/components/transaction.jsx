import classNames               from 'classnames';
import React                   from 'react';
import ContentLoader           from 'react-content-loader';
import PropTypes               from 'prop-types';
import {
    ContractAudit,
    Icon,
    Money,
    Popover }                  from '@deriv/components';
import { localize }            from '@deriv/translations';
import ContractUtils           from '@deriv/shared/utils/contract';
import PortfolioUtils          from '@deriv/shared/utils/portfolio';
import IconTradeType           from './icon-trade-types.jsx';
import { connect }             from '../stores/connect';
import { getContractTypeName } from '../utils/contract';

const TransactionIconWithText = ({
    icon,
    title,
    message,
    className,
}) => (
    <React.Fragment>
        <Popover
            className={classNames(className, 'transactions__icon')}
            alignment='left'
            message={title}
        >
            { icon }
        </Popover>
        { message }
    </React.Fragment>
);

const TransactionFieldLoader = ({ width }) => (
    <ContentLoader
        className='transactions__loader'
        height={10}
        width={80}
        speed={3}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='0' ry='0' width={width || '100'} height='12' />
    </ContentLoader>
);

const Transaction = ({
    active_transaction_id,
    contract,
    setActiveTransactionId,
}) => (
    <Popover
        alignment='left'
        className='transactions__item-wrapper'
        classNameBubble='transactions__contract-audit'
        is_open={active_transaction_id === contract.transaction_ids.buy}
        message={
            <ContractAudit
                contract_info={contract}
                contract_end_time={ContractUtils.getEndTime(contract)}
                is_dark_theme={false /* TODO: Dark theme for bot */ }
                duration={PortfolioUtils.getDurationTime(contract)}
                duration_unit={PortfolioUtils.getDurationUnitText(PortfolioUtils.getDurationPeriod(contract))}
                exit_spot={contract.exit_spot}
                should_add_scrollbars={false}
            />
        }
    >
        <div
            className='transactions__item'
            onClick={() => setActiveTransactionId(contract.transaction_ids.buy)}
        >
            <div className='transactions__cell transactions__symbol'>
                <TransactionIconWithText
                    icon={
                        <Icon
                            icon={contract.underlying ? `IcUnderlying${contract.underlying}` : 'IcUnknown'}
                            size={16}
                        />
                    }
                    title={contract.display_name}
                />
            </div>
            <div className='transactions__cell transactions__trade-type'>
                <TransactionIconWithText
                    icon={<IconTradeType type={contract.contract_type} size={16} />}
                    title={getContractTypeName(contract)}
                />
            </div>
            <div className='transactions__cell transactions__entry-spot'>
                <React.Fragment>
                    <Popover
                        className='transactions__icon'
                        alignment='left'
                        message={localize('Entry spot')}
                    >
                        <Icon icon='IcContractEntrySpot' />
                    </Popover>
                    { contract.entry_tick || <TransactionFieldLoader /> }
                </React.Fragment>
            </div>
            <div className='transactions__cell transactions__exit-spot'>
                <React.Fragment>
                    <Popover
                        className='transactions__icon'
                        alignment='left'
                        message={localize('Exit spot')}
                    >
                        <Icon icon='IcContractExitSpot' />
                    </Popover>
                    { contract.exit_tick || <TransactionFieldLoader /> }
                </React.Fragment>
            </div>
            <div className='transactions__cell transactions__stake'>
                <TransactionIconWithText
                    icon={<Icon icon='IcContractBuyPrice' />}
                    title={localize('Buy price')}
                    message={<Money amount={contract.buy_price} currency={contract.currency} />}
                />
            </div>
            <div className='transactions__cell transactions__profit'>
                { contract.profit ?
                    <div className={classNames({
                        'transactions__profit--win' : contract.profit > 0,
                        'transactions__profit--loss': contract.profit < 0,
                    })}
                    >
                        <Money
                            amount={Math.abs(contract.profit)}
                            currency={contract.currency}
                        />
                    </div>
                    :
                    <TransactionFieldLoader />
                }
            </div>
        </div>
    </Popover>
);

Transaction.propTypes = {
    active_transaction_id : PropTypes.number,
    contract              : PropTypes.object,
    setActiveTransactionId: PropTypes.func,
};

export default connect(({ transactions, run_panel }) => ({
    contract_stage        : run_panel.contract_stage,
    active_transaction_id : transactions.active_transaction_id,
    setActiveTransactionId: transactions.setActiveTransactionId,
}))(Transaction);
