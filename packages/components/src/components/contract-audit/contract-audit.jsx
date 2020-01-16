import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import ContentLoader     from 'react-content-loader';
import DateTimeUtils     from '@deriv/shared/utils/date-time';
import PositionsUtils    from '@deriv/shared/utils/positions';
import { localize }      from '@deriv/translations';
import ContractAuditItem from './contract-audit-item.jsx';
import Icon              from '../icon';
import ThemedScrollbars  from '../themed-scrollbars';

const ContractAuditLoader = () => (
    <div className='contract-audit__loader'>
        <ContentLoader
            height={12}
            width={150}
            speed={3}
            primaryColor={'var(--general-section-1)'}
            secondaryColor={'var(--general-hover)'}
        >
            <rect x='0' y='0' rx='0' ry='0' width='150' height='12' />
        </ContentLoader>
    </div>
);

const ContractAuditContentWrapper = ({ children, should_add_scrollbars }) => {
    return should_add_scrollbars ?
        <ThemedScrollbars
            // style={{ width: '100%', height: '100%' }}
            autohide
        >
            { children }
        </ThemedScrollbars>
        :
        <React.Fragment>
            { children }
        </React.Fragment>;
};

class ContractAudit extends React.PureComponent {
    render() {
        const {
            contract_end_time,
            contract_info,
            duration,
            duration_unit,
            exit_spot,
            should_add_scrollbars,
            is_contract_sellable,
        } = this.props;

        const is_profit    = (contract_info.profit >= 0);
        const IconExitTime = <Icon icon='IcContractExitTime' color={is_profit ? 'green' : 'red'} size={24} />;

        return (
            <div className={classNames(
                'contract-audit__wrapper',
                {
                    'contract-audit__wrapper--scrollbars': should_add_scrollbars,
                    'contract-audit__wrapper--sellable'  : should_add_scrollbars && is_contract_sellable,
                }
            )}
            >
                <ContractAuditContentWrapper should_add_scrollbars={should_add_scrollbars}>
                    <div id='dt_id_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={<Icon icon='IcContractId' size={24} />}
                            label={localize('Reference ID')}
                            value={localize('{{buy_value}} (Buy)', { buy_value: contract_info.transaction_ids.buy })}
                            value2={contract_info.transaction_ids.sell
                                ? localize('{{sell_value}} (Sell)', { sell_value: contract_info.transaction_ids.sell })
                                : <ContractAuditLoader />
                            }
                        />
                    </div>
                    <div id='dt_duration_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={<Icon icon='IcContractDuration' size={24} />}
                            label={localize('Duration')}
                            value={(contract_info.tick_count > 0)
                                ? `${contract_info.tick_count} ${(contract_info.tick_count < 2) ? localize('tick') : localize('ticks')}`
                                : `${duration} ${duration_unit}`}
                        />
                    </div>
                    <div id='dt_bt_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={
                                PositionsUtils.isDigitType(contract_info.contract_type)
                                    ? <Icon icon='IcContractTarget' size={24} />
                                    : <Icon icon='IcContractBarrier' size={24} />
                            }
                            label={PositionsUtils.getBarrierLabel(contract_info)}
                            value={contract_info.barrier
                                ? PositionsUtils.getBarrierValue(contract_info)
                                : <ContractAuditLoader />
                            }
                        />
                    </div>
                    <div id='dt_start_time_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={<Icon icon='IcContractStartTime' size={24} />}
                            label={localize('Start time')}
                            value={contract_info.purchase_time
                                ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_info.purchase_time))
                                : <ContractAuditLoader />
                            }
                        />
                    </div>
                    {!PositionsUtils.isDigitType(contract_info.contract_type) &&
                    <div id='dt_entry_spot_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={<Icon icon='IcContractEntrySpot' size={24} />}
                            label={localize('Entry spot')}
                            value={contract_info.entry_spot_display_value || <ContractAuditLoader />}
                            value2={contract_info.entry_tick_time
                                ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_info.entry_tick_time))
                                : <ContractAuditLoader />
                            }
                        />
                    </div>
                    }
                    {
                        !isNaN(exit_spot) &&
                        <div id='dt_exit_spot_label' className='contract-audit__grid'>
                            <ContractAuditItem
                                icon={<Icon icon='IcContractExitSpot' size={24} />}
                                label={localize('Exit spot')}
                                value={exit_spot || <ContractAuditLoader />}
                                value2={contract_info.exit_tick_time
                                    ? DateTimeUtils.toGMTFormat(
                                        DateTimeUtils.epochToMoment(contract_info.exit_tick_time)
                                    )
                                    : <ContractAuditLoader />
                                }
                            />
                        </div>
                    }
                    <div id='dt_exit_time_label' className='contract-audit__grid'>
                        <ContractAuditItem
                            icon={IconExitTime}
                            label={localize('Exit Time')}
                            value={
                                contract_end_time
                                    ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_end_time))
                                    : <ContractAuditLoader />
                            }
                        />
                    </div>
                </ContractAuditContentWrapper>
            </div>
        );
    }
}

ContractAudit.propTypes = {
    contract_end_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    contract_info        : PropTypes.object,
    duration             : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit        : PropTypes.string,
    exit_spot            : PropTypes.string,
    is_contract_sellable : PropTypes.bool,
    is_dark_theme        : PropTypes.bool,
    should_add_scrollbars: PropTypes.bool,

};

export default ContractAudit;
