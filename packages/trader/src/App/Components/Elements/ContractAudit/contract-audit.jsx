import PropTypes            from 'prop-types';
import React                from 'react';
import { ThemedScrollbars } from 'deriv-components';
import { localize }         from 'App/i18n';
import {
    epochToMoment,
    toGMTFormat }           from 'Utils/Date';
import {
    getBarrierLabel,
    getBarrierValue,
    isDigitType }           from 'App/Components/Elements/PositionsDrawer/helpers';
import { getThemedIcon }    from './Helpers/icons';
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
            is_dark_theme,
        } = this.props;
        if (!has_result) return null;
        const is_profit    = (contract_info.profit >= 0);
        const is_reset_call_put = /RESET(CALL|PUT)/.test(contract_info.contract_type);

        const is_tick = (contract_info.tick_count > 0);
        const contract_time = is_tick ? contract_info.tick_count : duration;
        const contract_unit = is_tick ? localize('ticks') : duration_unit;

        let duration_value_hint;
        if (is_reset_call_put) {
            duration_value_hint = localize(
                'The reset time is {{reset_time}} {{contract_unit}}',
                { reset_time: Math.floor(contract_time / 2),  contract_unit });
        }

        // For Reset callPut
        if (is_reset_call_put) {
            
        }

        return (
            <div className='contract-audit__wrapper'>
                <ThemedScrollbars
                    style={{ width: '100%', height: '100%' }}
                    autoHide
                >
                    <div id='dt_id_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={getThemedIcon('id', is_dark_theme)}
                            label={localize('Reference ID')}
                            value={localize('{{buy_value}} (Buy)', { buy_value: contract_info.transaction_ids.buy })}
                            value2={localize('{{sell_value}} (Sell)', { sell_value: contract_info.transaction_ids.sell })}
                        />
                    </div>
                    <div id='dt_duration_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={getThemedIcon('duration', is_dark_theme)}
                            label={localize('Duration')}
                            value={`${contract_time} ${contract_unit}`}
                            valueHint={duration_value_hint}
                        />
                    </div>
                    <div id='dt_bt_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={
                                isDigitType(contract_info.contract_type)
                                    ? getThemedIcon('target', is_dark_theme)
                                    : getThemedIcon('barrier', is_dark_theme)
                            }
                            label={getBarrierLabel(contract_info)}
                            value={getBarrierValue(contract_info) || ' - '}
                        />
                    </div>
                    { is_reset_call_put &&
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={getThemedIcon('reset_barrier', is_dark_theme)}
                                label={localize('Reset barrier')}
                                value={''}
                            />
                        </div>
                    }
                    <div id='dt_start_time_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={getThemedIcon('start_time', is_dark_theme)}
                            label={localize('Start time')}
                            value={toGMTFormat(epochToMoment(contract_info.purchase_time)) || ' - '}
                        />
                    </div>
                    { !isDigitType(contract_info.contract_type) &&
                    <div id='dt_entry_spot_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={getThemedIcon('entry_spot', is_dark_theme)}
                            label={localize('Entry spot')}
                            value={contract_info.entry_spot_display_value || ' - '}
                            value2={toGMTFormat(epochToMoment(contract_info.entry_tick_time)) || ' - '}
                        />
                    </div>
                    }
                    { is_reset_call_put &&
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={getThemedIcon('reset_time', is_dark_theme)}
                                label={localize('Reset time')}
                                value={toGMTFormat(epochToMoment(contract_info.reset_time)) || '-'}
                            />
                        </div>
                    }
                    { !isNaN(exit_spot) &&
                        <div id='dt_exit_spot_label' className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={is_profit ? getThemedIcon('exit_spot_win', is_dark_theme) : getThemedIcon('exit_spot_loss', is_dark_theme)}
                                label={localize('Exit spot')}
                                value={exit_spot || ' - '}
                                value2={toGMTFormat(epochToMoment(contract_info.exit_tick_time)) || ' - '}
                            />
                        </div>
                    }
                    <div id='dt_exit_time_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={is_profit ? getThemedIcon('exit_time_win', is_dark_theme) : getThemedIcon('exit_time_loss', is_dark_theme)}
                            label={localize('Exit Time')}
                            value={toGMTFormat(epochToMoment(contract_end_time)) || ' - '}
                        />
                    </div>
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
