import PropTypes from 'prop-types';
import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import ContractDetails from './contract-details.jsx';
import ContractHistory from './contract-history.jsx';

class ContractAudit extends React.Component {
    state = {
        contract_update_history: [],
    };

    static getDerivedStateFromProps({ is_multiplier, contract_update_history }, state) {
        if (!is_multiplier) return state;
        if (!!contract_update_history.length && contract_update_history.length > state.contract_update_history.length) {
            return {
                contract_update_history,
            };
        }
        return state;
    }

    onTabItemClick = tab_index => {
        this.props.toggleHistoryTab(tab_index);
        if (tab_index) {
            WS.contractUpdateHistory(this.props.contract_info.contract_id).then(response => {
                this.setState({
                    contract_update_history: response.contract_update_history,
                });
            });
        }
    };

    render() {
        const { has_result, is_multiplier, contract_info } = this.props;

        if (!has_result) return null;

        if (!is_multiplier) {
            return (
                <div className='contract-audit__wrapper'>
                    <ContractDetails {...this.props} />
                </div>
            );
        }

        return (
            <div className='contract-audit__wrapper'>
                <Tabs top className='contract-audit__tabs' onTabItemClick={this.onTabItemClick}>
                    <div label={localize('Details')}>
                        <ContractDetails {...this.props} />
                    </div>
                    <div label={localize('History')}>
                        <ContractHistory
                            currency={contract_info.currency}
                            history={this.state.contract_update_history}
                        />
                    </div>
                </Tabs>
            </div>
        );
    }
}

ContractAudit.propTypes = {
    contract_end_time: PropTypes.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    contract_info: PropTypes.object,
    contract_update_history: PropTypes.array,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot: PropTypes.string,
    has_result: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    toggleHistoryTab: PropTypes.func,
};

export default ContractAudit;
