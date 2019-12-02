import PropTypes            from 'prop-types';
import React                from 'react';
import { ThemedScrollbars } from 'deriv-components';
import { localize }         from 'deriv-translations';
import IconExitWon          from 'Assets/SvgComponents/contract_details/ic-exittime-won.svg';
import IconExitLoss         from 'Assets/SvgComponents/contract_details/ic-exittime-loss.svg';
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
        const IconExitTime = (is_profit) ? <IconExitWon /> : <IconExitLoss />;
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
                            value={(contract_info.tick_count > 0) ?
                                `${contract_info.tick_count} ${(contract_info.tick_count < 2) ? localize('tick') : localize('ticks')}`
                                :
                                `${duration} ${duration_unit}`}
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
                    <div id='dt_start_time_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={getThemedIcon('start_time', is_dark_theme)}
                            label={localize('Start time')}
                            value={toGMTFormat(epochToMoment(contract_info.purchase_time)) || ' - '}
                        />
                    </div>
                    {!isDigitType(contract_info.contract_type) &&
                    <div id='dt_entry_spot_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={getThemedIcon('entry_spot', is_dark_theme)}
                            label={localize('Entry spot')}
                            value={contract_info.entry_spot_display_value || ' - '}
                            value2={toGMTFormat(epochToMoment(contract_info.entry_tick_time)) || ' - '}
                        />
                    </div>
                    }
                    {
                        !isNaN(exit_spot) &&
                        <div id='dt_exit_spot_label' className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={getThemedIcon('exit_spot', is_dark_theme)}
                                label={localize('Exit spot')}
                                value={exit_spot || ' - '}
                                value2={toGMTFormat(epochToMoment(contract_info.exit_tick_time)) || ' - '}
                            />
                        </div>
                    }
                    <div id='dt_exit_time_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={IconExitTime}
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
