import PropTypes from 'prop-types';
import React from 'react';
import { Money, Icon, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import { epochToMoment, toGMTFormat } from '@deriv/shared/utils/date';
import {
    addCommaToNumber,
    getBarrierIcon,
    getBarrierLabel,
    getBarrierValue,
} from 'App/Components/Elements/PositionsDrawer/helpers';
import {
    getCancellationPrice,
    isCancellationExpired,
    isUserCancelled,
    isEnded,
} from 'Stores/Modules/Contract/Helpers/logic';
import { getResetDisplayValues } from 'Stores/Modules/Trading/Helpers/reset-time';
import { getDurationUnitText, getDurationUnit } from 'Stores/Modules/Portfolio/Helpers/details';
import { isMultiplierContract } from 'Stores/Modules/Contract/Helpers/multiplier';
import ContractAuditItem from './contract-audit-item.jsx';

const ContractDetails = ({ contract_end_time, contract_info, duration, duration_period, exit_spot }) => {
    const { commission, contract_type, currency, profit, transaction_ids: { buy, sell } = {} } = contract_info;

    const is_profit = profit >= 0;

    const cancellation_price = getCancellationPrice(contract_info);

    const getLabel = () => {
        if (isUserCancelled(contract_info)) return localize('Deal cancellation (executed)');
        if (isCancellationExpired(contract_info)) return localize('Deal cancellation (expired)');
        if (isEnded(contract_info)) return localize('Deal cancellation');
        return localize('Deal cancellation (active)');
    };

    const is_digit = /DIGIT/.test(contract_type);
    const is_reset_call_put = /RESET(CALL|PUT)/.test(contract_type);
    const is_multiplier = isMultiplierContract(contract_type);
    const is_tick = contract_info.tick_count > 0;
    const is_entry_spot_equal_barrier =
        addCommaToNumber(contract_info.entry_spot_display_value) === getBarrierValue(contract_info);

    const contract_time = is_tick ? contract_info.tick_count : duration;

    const contract_audit_item_list = [
        {
            container_id: 'dt_id_label',
            props: {
                icon: 'IcContractId',
                label: localize('Reference ID'),
                value: localize('{{buy_value}} (Buy)', { buy_value: buy }),
                value2: localize('{{sell_value}} (Sell)', { sell_value: sell }),
            },
            should_show: true,
        },
        {
            container_id: 'dt_commission_label',
            props: {
                icon: 'IcContractCommission',
                label: localize('Commission'),
                value: <Money amount={commission} currency={currency} />,
            },
            should_show: is_multiplier,
        },
        {
            container_id: 'dt_cancellation_label',
            props: {
                icon: 'IcContractSafeguard',
                label: getLabel(),
                value: <Money amount={cancellation_price} currency={currency} />,
            },
            should_show: is_multiplier && !!cancellation_price,
        },
        {
            container_id: 'dt_duration_label',
            props: {
                icon: 'IcContractDurationCircle',
                label: localize('Duration'),
                value: `${contract_time} ${getDurationUnitText(
                    duration_period,
                    contract_info.tick_count
                ).toLowerCase()}`,
                valueHint: is_reset_call_put
                    ? localize(
                          'The reset time is {{ reset_display_value }}',
                          getResetDisplayValues(contract_time, getDurationUnit(duration_period, is_tick))
                      )
                    : undefined,
            },
            should_show: true,
        },
        {
            container_id: 'dt_bt_label',
            props: {
                icon: getBarrierIcon(is_digit, is_reset_call_put, is_entry_spot_equal_barrier),
                label: getBarrierLabel(is_digit),
                value: is_reset_call_put
                    ? addCommaToNumber(contract_info.entry_spot_display_value)
                    : getBarrierValue(contract_info, is_digit),
            },
            should_show: true,
        },
        {
            props: {
                icon: 'IcContractBarrierSolid',
                label: localize('Reset barrier'),
                value: getBarrierValue(contract_info),
            },
            should_show: is_reset_call_put && !is_entry_spot_equal_barrier,
        },
        {
            container_id: 'dt_start_time_label',
            props: {
                icon: 'IcContractBuySellTimeCircle',
                label: localize('Buy time'),
                value: toGMTFormat(epochToMoment(contract_info.purchase_time)),
            },
            should_show: true,
        },
        {
            container_id: 'dt_entry_spot_label',
            props: {
                icon: 'IcContractEntrySpotCircle',
                label: localize('Entry spot'),
                value: contract_info.entry_spot_display_value,
                value2: toGMTFormat(epochToMoment(contract_info.entry_tick_time)) || '-',
            },
            should_show: !is_digit,
        },
        {
            props: {
                icon: 'IcContractResetTimeCircle',
                label: localize('Reset time'),
                value: toGMTFormat(epochToMoment(contract_info.reset_time)),
            },
            should_show: is_reset_call_put,
        },
        {
            container_id: 'dt_exit_spot_label',
            props: {
                icon: 'IcContractExitSpotCircle',
                icon_color: is_profit ? 'green' : 'red',
                label: localize('Exit spot'),
                value: exit_spot,
                value2: toGMTFormat(epochToMoment(contract_info.exit_tick_time)) || '-',
            },
            should_show: !isNaN(exit_spot),
        },
        {
            container_id: 'dt_exit_time_label',
            props: {
                icon: 'IcContractBuySellTimeCircle',
                icon_color: is_profit ? 'green' : 'red',
                label: localize('Sell Time'),
                value: toGMTFormat(epochToMoment(contract_end_time)),
            },
            should_show: !isNaN(contract_end_time),
        },
    ];

    return (
        <ThemedScrollbars autoHide renderView={props => <div {...props} className='contract-audit__tabs-content' />}>
            {contract_audit_item_list.map((item, index) => {
                if (!item.should_show) return undefined;

                const { container_id, icon, icon_color, label, value, value2, valueHint } = item.props;

                return (
                    <ContractAuditItem
                        key={index}
                        id={container_id}
                        icon={<Icon icon={icon} color={icon_color} />}
                        label={label}
                        value={value}
                        value2={value2}
                        valueHint={valueHint}
                    />
                );
            })}
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
