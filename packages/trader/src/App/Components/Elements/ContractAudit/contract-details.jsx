import PropTypes from 'prop-types';
import React from 'react';
import { Money, Icon, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import {
    epochToMoment,
    toGMTFormat,
    getCancellationPrice,
    isEnded,
    isMobile,
    isMultiplierContract,
} from '@deriv/shared';
import {
    addCommaToNumber,
    getBarrierLabel,
    getBarrierValue,
    isDigitType,
} from 'App/Components/Elements/PositionsDrawer/helpers';
import { isCancellationExpired, isUserCancelled } from 'Stores/Modules/Contract/Helpers/logic';
import ContractAuditItem from './contract-audit-item.jsx';

const ContractDetails = ({ contract_end_time, contract_info, duration, duration_unit, exit_spot }) => {
    const {
        commission,
        contract_type,
        currency,
        entry_spot_display_value,
        entry_tick_time,
        exit_tick_time,
        profit,
        purchase_time,
        tick_count,
        transaction_ids: { buy, sell } = {},
    } = contract_info;

    const is_profit = profit >= 0;

    const cancellation_price = getCancellationPrice(contract_info);

    const getLabel = () => {
        if (isUserCancelled(contract_info)) return localize('Deal cancellation (executed)');
        if (isCancellationExpired(contract_info)) return localize('Deal cancellation (expired)');
        if (isEnded(contract_info)) return localize('Deal cancellation');
        return localize('Deal cancellation (active)');
    };

    return (
        <ThemedScrollbars is_bypassed={isMobile()}>
            <div className='contract-audit__tabs-content'>
                <ContractAuditItem
                    id='dt_id_label'
                    icon={<Icon icon='IcContractId' size={24} />}
                    label={localize('Reference ID')}
                    value={localize('{{buy_value}} (Buy)', { buy_value: buy })}
                    value2={sell ? localize('{{sell_value}} (Sell)', { sell_value: sell }) : undefined}
                />
                {isMultiplierContract(contract_type) ? (
                    <React.Fragment>
                        <ContractAuditItem
                            id='dt_commission_label'
                            icon={<Icon icon='IcContractCommission' size={24} />}
                            label={localize('Commission')}
                            value={<Money amount={commission} currency={currency} show_currency />}
                        />
                        {!!cancellation_price && (
                            <ContractAuditItem
                                id='dt_cancellation_label'
                                icon={<Icon icon='IcContractSafeguard' size={24} />}
                                label={getLabel()}
                                value={<Money amount={cancellation_price} currency={currency} />}
                            />
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <ContractAuditItem
                            id='dt_duration_label'
                            icon={<Icon icon='IcContractDuration' size={24} />}
                            label={localize('Duration')}
                            value={
                                tick_count > 0
                                    ? `${tick_count} ${tick_count < 2 ? localize('tick') : localize('ticks')}`
                                    : `${duration} ${duration_unit}`
                            }
                        />
                        <ContractAuditItem
                            id='dt_bt_label'
                            icon={
                                isDigitType(contract_type) ? (
                                    <Icon icon='IcContractTarget' size={24} />
                                ) : (
                                    <Icon icon='IcContractBarrier' size={24} />
                                )
                            }
                            label={getBarrierLabel(contract_info)}
                            value={getBarrierValue(contract_info) || ' - '}
                        />
                    </React.Fragment>
                )}
                <ContractAuditItem
                    id='dt_start_time_label'
                    icon={<Icon icon='IcContractStartTime' size={24} />}
                    label={localize('Start time')}
                    value={toGMTFormat(epochToMoment(purchase_time)) || ' - '}
                />
                {!isDigitType(contract_type) && (
                    <ContractAuditItem
                        id='dt_entry_spot_label'
                        icon={<Icon icon='IcContractEntrySpot' size={24} />}
                        label={localize('Entry spot')}
                        value={addCommaToNumber(entry_spot_display_value) || ' - '}
                        value2={toGMTFormat(epochToMoment(entry_tick_time)) || ' - '}
                    />
                )}
                {!isNaN(exit_spot) && (
                    <ContractAuditItem
                        id='dt_exit_spot_label'
                        icon={<Icon icon='IcContractExitSpot' size={24} />}
                        label={localize('Exit spot')}
                        value={addCommaToNumber(exit_spot) || ' - '}
                        value2={toGMTFormat(epochToMoment(exit_tick_time)) || ' - '}
                    />
                )}
                {!isNaN(contract_end_time) && (
                    <ContractAuditItem
                        id='dt_exit_time_label'
                        icon={<Icon icon='IcContractExitTime' color={is_profit ? 'green' : 'red'} size={24} />}
                        label={localize('Exit time')}
                        value={toGMTFormat(epochToMoment(contract_end_time)) || ' - '}
                    />
                )}
            </div>
        </ThemedScrollbars>
    );
};

ContractDetails.propTypes = {
    contract_end_time: PropTypes.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    contract_info: PropTypes.object,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot: PropTypes.string,
};

export default ContractDetails;
