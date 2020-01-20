import classNames              from 'classnames';
import React                   from 'react';
import PropTypes               from 'prop-types';
import {
    ContractAudit,
    Icon,
    Money,
    Popover }                  from '@deriv/components';
import { localize }            from '@deriv/translations';
import ContractUtils           from '@deriv/shared/utils/contract';
import DateTimeUtils           from '@deriv/shared/utils/date-time';
import PortfolioUtils          from '@deriv/shared/utils/portfolio';
import PositionsUtils          from '@deriv/shared/utils/positions';
import TransactionFieldLoader  from './transaction-field-loader.jsx';
import IconTradeType           from '../icon-trade-types.jsx';
import config                  from '../../constants';
import {
    getDurationUnitMap,
    getBarrierLabelMap,
    getDigitTypeMap }          from '../../constants/strings-map';
import { connect }             from '../../stores/connect';
import { getContractTypeName } from '../../utils/contract'; // TODO: [use-shared-helpers]

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

const getContractAuditComponent = (contract_info) => {
    const contract_end_time = ContractUtils.getEndTime(contract_info);
    const duration          = PortfolioUtils.getDurationTime(contract_info);
    const duration_unit     = PortfolioUtils.getDurationUnitText(
        PortfolioUtils.getDurationPeriod(contract_info),
        getDurationUnitMap()
    );
    const exit_spot         = ContractUtils.isUserSold(contract_info) ? '-' : contract_info.exit_tick_display_value;
    const is_profit         = contract_info.profit > 0;
    const is_valid_to_sell  = ContractUtils.isValidToSell(contract_info);
    const IconExitTime      = <Icon icon='IcContractExitTime' color={is_profit ? 'green' : 'red'} size={24} />;

    return (
        <ContractAudit is_contract_sellable={is_valid_to_sell}>
            <ContractAudit.Item
                id='db_id_label'
                icon={<Icon icon='IcContractId' size={24} />}
                label={localize('Reference ID')}
                value={localize('{{buy_value}} (Buy)', { buy_value: contract_info.transaction_ids.buy })}
                value2={contract_info.transaction_ids.sell
                    ? localize('{{sell_value}} (Sell)', { sell_value: contract_info.transaction_ids.sell })
                    : <ContractAudit.Loader />
                }
            />
            <ContractAudit.Item
                id='db_duration_label'
                icon={<Icon icon='IcContractDuration' size={24} />}
                label={localize('Duration')}
                value={(contract_info.tick_count > 0)
                    ? `${contract_info.tick_count} ${(contract_info.tick_count < 2) ? localize('tick') : localize('ticks')}`
                    : `${duration} ${duration_unit}`}
            />
            <ContractAudit.Item
                id='db_bt_label'
                icon={
                    <Icon
                        icon={PositionsUtils.isDigitType(contract_info.contract_type) ? 'IcContractTarget' : 'IcContractBarrier'}
                        size={24}
                    />
                }
                label={PositionsUtils.getBarrierLabel(contract_info, getBarrierLabelMap())}
                value={contract_info.barrier
                    ? PositionsUtils.getBarrierValue(contract_info, getDigitTypeMap)
                    : <ContractAudit.Loader />
                }
            />
            <ContractAudit.Item
                id='db_start_time_label'
                icon={<Icon icon='IcContractStartTime' size={24} />}
                label={localize('Start time')}
                value={contract_info.purchase_time
                    ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_info.purchase_time))
                    : <ContractAudit.Loader />
                }
            />
            { !PositionsUtils.isDigitType(contract_info.contract_type) &&
                <ContractAudit.Item
                    id='db_entry_spot_label'
                    icon={<Icon icon='IcContractEntrySpot' size={24} />}
                    label={localize('Entry spot')}
                    value={contract_info.entry_spot_display_value || <ContractAudit.Loader />}
                    value2={contract_info.entry_tick_time
                        ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_info.entry_tick_time))
                        : <ContractAudit.Loader />
                    }
                />
            }
            { !isNaN(exit_spot) &&
                <ContractAudit.Item
                    id='db_exit_spot_label'
                    icon={<Icon icon='IcContractExitSpot' size={24} />}
                    label={localize('Exit spot')}
                    value={exit_spot || <ContractAudit.Loader />}
                    value2={contract_info.exit_tick_time
                        ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_info.exit_tick_time))
                        : <ContractAudit.Loader />
                    }
                />
            }
            <ContractAudit.Item
                id='db_exit_time_label'
                icon={IconExitTime}
                label={localize('Exit Time')}
                value={
                    contract_end_time
                        ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_end_time))
                        : <ContractAudit.Loader />
                }
            />
        </ContractAudit>
    );
};

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
        message={getContractAuditComponent(contract)}
        zIndex={config.popover_zindex.contract_audit}
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
