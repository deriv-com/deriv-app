import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { Scrollbars }    from 'tt-react-custom-scrollbars';
import { localize }      from '_common/localize';
import {
    epochToMoment,
    toGMTFormat }        from 'Utils/Date';
import {
    addCommaToNumber,
    getBarrierLabel,
    getBarrierValue  }   from 'App/Components/Elements/PositionsDrawer/helpers';
import ContractAuditItem from './contract-audit-item.jsx';

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
                                label={localize('Reference ID)')}
                                value={localize('[_1] (Buy)', contract_info.transaction_ids.buy)}
                                value2={localize('[_1] (Sell)', contract_info.transaction_ids.sell)}
                            />
                        </div>
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                label={localize('Duration')}
                                value={(contract_info.tick_count > 0) ?
                                    `${contract_info.tick_count} ${(contract_info.tick_count < 2) ? localize('tick') : localize('ticks')}`
                                    :
                                    `${duration} ${duration_unit}`}
                            />
                        </div>
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                label={getBarrierLabel(contract_info)}
                                value={getBarrierValue(contract_info) || ' - '}
                            />
                        </div>
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                label={localize('Start time')}
                                value={toGMTFormat(epochToMoment(contract_info.purchase_time)) || ' - '}
                            />
                        </div>
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                label={localize('Entry spot')}
                                value={addCommaToNumber(contract_info.entry_spot) || ' - '}
                                value2={toGMTFormat(epochToMoment(contract_info.entry_tick_time)) || ' - '}
                            />
                        </div>
                        {
                            !isNaN(exit_spot) &&
                            <div className='contract-audit__grid'>
                                <ContractAuditItem
                                    label={localize('Exit spot')}
                                    value={addCommaToNumber(exit_spot) || ' - '}
                                    value2={toGMTFormat(epochToMoment(contract_info.exit_tick_time)) || ' - '}
                                />
                            </div>
                        }
                        <div className='contract-audit__grid'>
                            <ContractAuditItem
                                label={localize('End time')}
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
    duration     : PropTypes.number,
    duration_unit: PropTypes.string,
    exit_spot    : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    has_result   : PropTypes.bool,
    is_open      : PropTypes.bool,
};

export default ContractAudit;
