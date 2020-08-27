import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { ContractCard } from '@deriv/components';
import ContractCardLoader from './contract-card-loading.jsx';
import { connect } from '../stores/connect';
import '../assets/sass/summary-card.scss';
import { getCardLabels, getContractTypeDisplay } from '../constants/contract';

const SummaryCard = ({
    contract,
    is_contract_completed,
    is_contract_loading,
    is_contract_inactive,
    is_mobile,
    server_time,
}) => {
    return (
        <div
            className={classNames('db-summary-card', {
                'db-summary-card--mobile': is_mobile,
                'db-summary-card--inactive': is_contract_inactive,
                'db-summary-card--is-loading': is_contract_loading,
                'db-summary-card--completed': is_contract_completed,
                'db-summary-card--completed-mobile': is_contract_completed && is_mobile,
            })}
        >
            {is_contract_loading && <ContractCardLoader speed={2} />}
            {!is_contract_loading && contract && (
                <ContractCard
                    contract_info={contract}
                    currency={contract.currency}
                    getCardLabels={getCardLabels}
                    getContractTypeDisplay={getContractTypeDisplay}
                    is_mobile={is_mobile}
                    is_positions={false}
                    profit_loss={contract.profit}
                    server_time={server_time}
                    should_show_profit_loss_overlay={true}
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
    is_mobile: PropTypes.bool,
    server_time: PropTypes.object,
};

export default connect(({ summary_card, common, ui }) => ({
    contract: summary_card.contract,
    is_contract_completed: summary_card.is_contract_completed,
    is_contract_inactive: summary_card.is_contract_inactive,
    is_contract_loading: summary_card.is_contract_loading,
    is_mobile: ui.is_mobile,
    server_time: common.server_time,
}))(SummaryCard);
