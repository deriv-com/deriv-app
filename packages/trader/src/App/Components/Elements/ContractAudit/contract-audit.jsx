import PropTypes            from 'prop-types';
import React                from 'react';
import {
    Icon,
    ThemedScrollbars }      from 'deriv-components';
import { localize }         from 'deriv-translations';
import {
    epochToMoment,
    toGMTFormat }           from 'Utils/Date';
import {
    addCommaToNumber,
    getBarrierLabel,
    getBarrierValue,
    isDigitType,
    isResetCallPutType }    from 'App/Components/Elements/PositionsDrawer/helpers';
import ContractAuditItem    from './contract-audit-item.jsx';

class ContractAudit extends React.PureComponent {
    render() {
        const {
            contract_end_time,
            contract_info,
            duration,
            duration_unit,
            exit_spot,
            has_result,
        } = this.props;

        if (!has_result) return null;

        // Contract type checks
        const is_digit          = isDigitType(contract_info.contract_type);
        const is_reset_call_put = isResetCallPutType(contract_info.contract_type);

        const is_profit = (contract_info.profit >= 0);

        const is_tick = (contract_info.tick_count > 0);
        const contract_time = is_tick ? contract_info.tick_count : duration;
        const contract_unit = is_tick ? localize('ticks') : duration_unit;

        const contract_audit_item_config_list = [
            {
                containerId           : 'dt_id_label',
                contractAuditItemProps: {
                    icon  : 'IcContractId',
                    label : localize('Reference ID'),
                    value : localize('{{buy_value}} (Buy)', { buy_value: contract_info.transaction_ids.buy }),
                    value2: localize('{{sell_value}} (Sell)', { sell_value: contract_info.transaction_ids.sell }),
                },
                shouldShow: true,
            },
            {
                containerId           : 'dt_duration_label',
                contractAuditItemProps: {
                    icon     : 'IcContractDurationCircle',
                    label    : localize('Duration'),
                    value    : `${contract_time} ${contract_unit}`,
                    valueHint: is_reset_call_put ? localize('The reset time is {{reset_time}} {{contract_unit}}', { reset_time: Math.floor(contract_time / 2),  contract_unit }) : undefined,
                },
                shouldShow: true,
            },
            {
                containerId           : 'dt_bt_label',
                contractAuditItemProps: {
                    icon : is_digit ? 'IcContractTarget' : 'IcContractBarrierDotted',
                    label: getBarrierLabel(contract_info),
                    value: is_reset_call_put
                        ? addCommaToNumber(contract_info.entry_spot)
                        : getBarrierValue(contract_info),
                },
                shouldShow: true,
            },
            {
                contractAuditItemProps: {
                    icon : 'IcContractBarrierSolid',
                    label: localize('Reset barrier'),
                    value: getBarrierValue(contract_info),
                },
                shouldShow: is_reset_call_put,
            },
            {
                containerId           : 'dt_start_time_label',
                contractAuditItemProps: {
                    icon : 'IcContractBuySellTimeCircle',
                    label: localize('Buy time'),
                    value: toGMTFormat(epochToMoment(contract_info.purchase_time)),
                },
                shouldShow: is_reset_call_put,
            },
            {
                containerId           : 'dt_entry_spot_label',
                contractAuditItemProps: {
                    icon  : 'IcContractEntrySpotCircle',
                    label : localize('Entry spot'),
                    value : contract_info.entry_spot_display_value,
                    value2: toGMTFormat(epochToMoment(contract_info.entry_tick_time)) || '-',
                },
                shouldShow: !is_digit,
            },
            {
                contractAuditItemProps: {
                    icon : 'IcContractResetTimeCircle',
                    label: localize('Reset time'),
                    value: toGMTFormat(epochToMoment(contract_info.reset_time)),
                },
                shouldShow: is_reset_call_put,
            },
            {
                containerId           : 'dt_exit_spot_label',
                contractAuditItemProps: {
                    icon     : 'IcContractExitSpotCircle',
                    iconColor: is_profit ? 'green' : 'red',
                    label    : localize('Exit spot'),
                    value    : exit_spot,
                    value2   : toGMTFormat(epochToMoment(contract_info.exit_tick_time)) || '-',
                },
                shouldShow: !isNaN(exit_spot),
            },
            {
                containerId           : 'dt_exit_time_label',
                contractAuditItemProps: {
                    icon     : 'IcContractBuySellTimeCircle',
                    iconColor: is_profit ? 'green' : 'red',
                    label    : localize('Sell Time'),
                    value    : toGMTFormat(epochToMoment(contract_end_time)),
                },
                shouldShow: true,
            },
        ];

        return (
            <div className='contract-audit__wrapper'>
                <ThemedScrollbars
                    style={{ width: '100%', height: '100%' }}
                    autoHide
                >
                    { contract_audit_item_config_list.map((contract_audit_item_config, index) => {
                        const {
                            icon,
                            iconColor,
                            label,
                            value,
                            value2,
                            valueHint,
                        } = contract_audit_item_config.contractAuditItemProps;

                        const contract_audit_item = (
                            <div key={index} id={contract_audit_item_config.containerId} className='contract-audit__grid'>
                                <ContractAuditItem
                                    icon={<Icon icon={icon} color={iconColor} size={16} />}
                                    label={label}
                                    value={value}
                                    value2={value2}
                                    valueHint={valueHint}
                                />
                            </div>
                        );

                        return contract_audit_item_config.shouldShow ? contract_audit_item : undefined;
                    })}
                </ThemedScrollbars>
            </div>
        );
    }
}

ContractAudit.propTypes = {
    contract_end_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    contract_info: PropTypes.object,
    duration     : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot    : PropTypes.string,
    has_result   : PropTypes.bool,
    is_dark_theme: PropTypes.bool,
    is_open      : PropTypes.bool,
};

export default ContractAudit;
