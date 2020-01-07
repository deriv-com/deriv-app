import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import { Tabs }        from '@deriv/components';
import { localize }    from '@deriv/translations';
import { WS }          from 'Services/ws-methods';
import ContractDetails from './contract-details.jsx';
import ContractHistory from './contract-history.jsx';

class ContractAudit extends React.Component {
    state = {
        history: [],
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.is_multiplier) return state;
        if (props.contract_update_history && props.contract_update_history.length !== state.history.length) {
            return {
                history: props.contract_update_history,
            };
        }
        return state;
    }

    onTabItemClick = (tab_index) => {
        if (tab_index && !this.state.history.length) {
            WS.contractUpdate(this.props.contract_info.contract_id, { history: 1 }).then(response => {
                this.setState({
                    history: response.contract_update.history,
                });
            });
        }
    }

    render() {
        const {
            has_result,
            is_multiplier,
            contract_info,
        } = this.props;

        if (!has_result) return null;

        if (!is_multiplier) {
            return (
                <div className='contract-audit__wrapper'>
                    <ContractDetails {...this.props} />
                </div>
            );
        }

        return (
            <div className={classNames('contract-audit__wrapper', {
                'contract-audit__wrapper-tabs--active' : !contract_info.is_sold,
                'contract-audit__wrapper-tabs--expired': contract_info.is_sold,
            })}
            >
                <Tabs top className='contract-audit__wrapper-tabs' onTabItemClick={this.onTabItemClick}>
                    <div label={localize('Details')}>
                        <ContractDetails {...this.props} />
                    </div>
                    <div label={localize('History')}>
                        <ContractHistory
                            currency={contract_info.currency}
                            history={this.state.history}
                        />
                    </div>
                </Tabs>
            </div>
        );
    }
}

ContractAudit.propTypes = {
    contract_end_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    contract_info          : PropTypes.object,
    contract_update_history: PropTypes.array,
    duration               : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit          : PropTypes.string,
    exit_spot              : PropTypes.string,
    has_result             : PropTypes.bool,
    is_multiplier          : PropTypes.bool,
};

export default ContractAudit;
