import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { ContractCard } from '@deriv/components';
import ContractCardLoader from 'Components/contract-card-loading';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { connect } from 'Stores/connect';

const SummaryCard = ({
    contract,
    is_contract_completed,
    is_contract_loading,
    is_contract_inactive,
    is_mobile,
    onClickSell,
    is_sell_requested,
    server_time,
}) => {
    const card_header = (
        <ContractCard.Header
            contract_info={contract}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={true}
            is_mobile={is_mobile}
            is_sold={is_contract_completed}
            server_time={server_time}
        />
    );

    const card_body = (
        <ContractCard.Body
            contract_info={contract}
            currency={contract && contract.currency}
            getCardLabels={getCardLabels}
            is_mobile={is_mobile}
            is_sold={is_contract_completed}
            server_time={server_time}
        />
    );

    const card_footer = (
        <ContractCard.Footer
            contract_info={contract}
            getCardLabels={getCardLabels}
            is_sell_requested={is_sell_requested}
            onClickSell={onClickSell}
        />
    );

    const contract_el = (
        <React.Fragment>
            {card_header}
            {card_body}
            {card_footer}
        </React.Fragment>
    );

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
                    getCardLabels={getCardLabels}
                    profit_loss={contract.profit}
                    should_show_result_overlay={true}
                >
                    <div
                        className={classNames('dc-contract-card', {
                            'dc-contract-card--green': contract.profit > 0,
                            'dc-contract-card--red': contract.profit < 0,
                        })}
                    >
                        {contract_el}
                    </div>
                </ContractCard>
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

export default connect(({ summary_card, common, run_panel, ui }) => ({
    contract: summary_card.contract,
    is_contract_completed: summary_card.is_contract_completed,
    is_contract_inactive: summary_card.is_contract_inactive,
    is_contract_loading: summary_card.is_contract_loading,
    is_mobile: ui.is_mobile,
    onClickSell: run_panel.onClickSell,
    is_sell_requested: run_panel.is_sell_requested,
    server_time: common.server_time,
}))(SummaryCard);
