import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { Scrollbars }           from 'tt-react-custom-scrollbars';
import { localize }             from 'App/i18n';
import IconExitWon              from 'Assets/SvgComponents/contract_details/ic-exittime-won.svg';
import IconExitLoss             from 'Assets/SvgComponents/contract_details/ic-exittime-loss.svg';
import {
    epochToMoment,
    toGMTFormat }               from 'Utils/Date';
import {
    addCommaToNumber,
    getBarrierLabel,
    getBarrierValue,
    isDigitType }               from 'App/Components/Elements/PositionsDrawer/helpers';
import { getUnderlyingPipSize } from 'Stores/Modules/Trading/Helpers/active-symbols';
import { getThemedIcon }        from './Helpers/icons';
import ContractAuditItem        from './contract-audit-item.jsx';

class ContractAudit extends React.PureComponent {
    state = {
        decimal_places: null,
    };

    componentDidMount = async () => {
        const decimal_places = await getUnderlyingPipSize(this.props.contract_info.underlying);
        this.setState({ decimal_places });
    };

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
            <React.Fragment>
                <div className={classNames('contract-audit__wrapper', {
                    'contract-audit__wrapper--is-open': !!(contract_info.is_sold),
                })}
                >
                    <Scrollbars
                        style={{ width: '100%', height: '100%' }}
                        autoHide
                    >
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={getThemedIcon('id', is_dark_theme)}
                                label={localize('Reference ID')}
                                value={localize('{{buy_value}} (Buy)', { buy_value: contract_info.transaction_ids.buy })}
                                value2={localize('{{sell_value}} (Sell)', { sell_value: contract_info.transaction_ids.sell })}
                            />
                        </div>
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={getThemedIcon('duration', is_dark_theme)}
                                label={localize('Duration')}
                                value={(contract_info.tick_count > 0) ?
                                    `${contract_info.tick_count} ${(contract_info.tick_count < 2) ? localize('tick') : localize('ticks')}`
                                    :
                                    `${duration} ${duration_unit}`}
                            />
                        </div>
                        <div className='contract-audit__grid'>
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
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={getThemedIcon('start_time', is_dark_theme)}
                                label={localize('Start time')}
                                value={toGMTFormat(epochToMoment(contract_info.purchase_time)) || ' - '}
                            />
                        </div>
                        {!isDigitType(contract_info.contract_type) &&
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={getThemedIcon('entry_spot', is_dark_theme)}
                                label={localize('Entry spot')}
                                value={addCommaToNumber(contract_info.entry_spot, this.state.decimal_places) || ' - '}
                                value2={toGMTFormat(epochToMoment(contract_info.entry_tick_time)) || ' - '}
                            />
                        </div>
                        }
                        {
                            !isNaN(exit_spot) &&
                            <div className='contract-audit__grid'>
                                <ContractAuditItem
                                    icon={getThemedIcon('exit_spot', is_dark_theme)}
                                    label={localize('Exit spot')}
                                    value={addCommaToNumber(exit_spot, this.state.decimal_places) || ' - '}
                                    value2={toGMTFormat(epochToMoment(contract_info.exit_tick_time)) || ' - '}
                                />
                            </div>
                        }
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={IconExitTime}
                                label={localize('Exit Time')}
                                value={toGMTFormat(epochToMoment(contract_end_time)) || ' - '}
                            />
                        </div>
                    </Scrollbars>
                </div>
            </React.Fragment>
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
    exit_spot    : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    has_result   : PropTypes.bool,
    is_dark_theme: PropTypes.bool,
    is_open      : PropTypes.bool,
};

export default ContractAudit;
