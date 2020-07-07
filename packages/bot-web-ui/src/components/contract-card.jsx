import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { getContractPath } from '@deriv/shared';
import { ContractCard } from '@deriv/components';
import ContractCardLoader from './contract-card-loading.jsx';
import { connect } from '../stores/connect';
import '../assets/sass/contract-card.scss';
import { card_labels, getContractTypeDisplay } from '../constants/contract';

const ContractCardComponent = ({
    contract,
    is_contract_completed,
    is_contract_loading,
    is_contract_losing,
    is_contract_inactive,
    is_contract_winning,
    server_time,
}) => {
    return (
        <div
            className={classNames('db-contract-card', {
                'db-contract-card--inactive': is_contract_inactive,
                'db-contract-card--is-loading': is_contract_loading,
                'db-contract-card--is-winning': is_contract_winning,
                'db-contract-card--is-losing': is_contract_losing,
                'db-contract-card--completed': is_contract_completed,
            })}
        >
            {is_contract_loading && <ContractCardLoader speed={2} />}
            {!is_contract_loading && contract && (
                <ContractCard
                    card_labels={card_labels}
                    contract_info={contract}
                    currency={contract.currency}
                    getContractPath={getContractPath}
                    getContractTypeDisplay={getContractTypeDisplay}
                    is_positions={false}
                    profit_loss={contract.profit}
                    result={contract.status}
                    server_time={server_time}
                    status={contract.status}
                />
            )}
            {!is_contract_loading && !contract && (
                <React.Fragment>
                    {localize('Build a bot from the start menu then hit the run button to run the bot.')}
                </React.Fragment>
            )}
        </div>
    );
};

ContractCardComponent.propTypes = {
    contract: PropTypes.object,
    is_contract_completed: PropTypes.bool,
    is_contract_inactive: PropTypes.bool,
    is_contract_loading: PropTypes.bool,
    is_contract_losing: PropTypes.bool,
    is_contract_winning: PropTypes.bool,
};

export default connect(({ contract_card, server_time }) => ({
    contract: contract_card.contract,
    is_contract_completed: contract_card.is_contract_completed,
    is_contract_loading: contract_card.is_contract_loading,
    is_contract_losing: contract_card.is_contract_losing,
    is_contract_inactive: contract_card.is_contract_inactive,
    is_contract_winning: contract_card.is_contract_winning,
    server_time,
}))(ContractCardComponent);
