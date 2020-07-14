import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { ContractCard } from '@deriv/components';
import ContractCardLoader from './contract-card-loading.jsx';
import { connect } from '../stores/connect';
import '../assets/sass/summary-card.scss';
import { card_labels, getContractTypeDisplay } from '../constants/contract';

const SummaryCard = ({
    contract,
    is_contract_completed,
    is_contract_loading,
    is_contract_losing,
    is_contract_inactive,
    is_contract_winning,
    is_mobile,
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
                'db-contract-card--completed-mobile': is_contract_completed && is_mobile,
            })}
        >
            {is_contract_loading && <ContractCardLoader speed={2} />}
            {!is_contract_loading && contract && (
                <ContractCard
                    card_labels={card_labels}
                    contract_info={contract}
                    currency={contract.currency}
                    getContractTypeDisplay={getContractTypeDisplay}
                    is_positions={false}
                    profit_loss={contract.profit}
                    server_time={server_time}
                    should_show_result_overlay={true}
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

SummaryCard.propTypes = {
    contract: PropTypes.object,
    is_contract_completed: PropTypes.bool,
    is_contract_inactive: PropTypes.bool,
    is_contract_loading: PropTypes.bool,
    is_contract_losing: PropTypes.bool,
    is_contract_winning: PropTypes.bool,
    is_mobile: PropTypes.bool,
};

export default connect(({ contract_card, common, ui }) => ({
    contract: contract_card.contract,
    is_contract_completed: contract_card.is_contract_completed,
    is_contract_loading: contract_card.is_contract_loading,
    is_contract_losing: contract_card.is_contract_losing,
    is_contract_inactive: contract_card.is_contract_inactive,
    is_contract_winning: contract_card.is_contract_winning,
    is_mobile: ui.is_mobile,
    server_time: common.server_time,
}))(SummaryCard);
