import PropTypes from 'prop-types';
import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import ContractDetails from './contract-details.jsx';
import ContractHistory from './contract-history.jsx';

const ContractAudit = ({ contract_update_history, has_result, is_multiplier, toggleHistoryTab, ...props }) => {
    const { contract_id, currency } = props.contract_info;
    const [update_history, setUpdateHistory] = React.useState([]);

    React.useEffect(() => {
        if (!!contract_update_history.length && contract_update_history.length > update_history.length)
            setUpdateHistory(contract_update_history);
    }, [contract_update_history, update_history]);

    const onTabItemClick = tab_index => {
        toggleHistoryTab(tab_index);
        if (tab_index) {
            WS.contractUpdateHistory(contract_id).then(response => {
                setUpdateHistory(response.contract_update_history);
            });
        }
    };

    if (!has_result) return null;

    if (!is_multiplier) {
        return (
            <div className='contract-audit__wrapper'>
                <ContractDetails {...props} />
            </div>
        );
    }
    return (
        <div className='contract-audit__wrapper'>
            <Tabs top className='contract-audit__tabs' onTabItemClick={onTabItemClick}>
                <div label={localize('Details')}>
                    <ContractDetails {...props} />
                </div>
                <div label={localize('History')}>
                    <ContractHistory currency={currency} history={update_history} />
                </div>
            </Tabs>
        </div>
    );
};

ContractAudit.propTypes = {
    contract_info: PropTypes.object,
    contract_update_history: PropTypes.array,
    has_result: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    toggleHistoryTab: PropTypes.func,
};

export default ContractAudit;
