import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ContractCard } from '@deriv/components';
import { getContractPath, isMultiplierContract } from '@deriv/shared';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { connect } from 'Stores/connect';
import { connectWithContractUpdate } from 'Stores/Modules/Contract/Helpers/multiplier';

const PositionsDrawerCard = ({
    addToast,
    className,
    display_name,
    contract_info,
    contract_update,
    currency,
    current_focus,
    getContractById,
    is_mobile,
    is_sell_requested,
    is_unsupported,
    is_link_disabled,
    profit_loss,
    onClickCancel,
    onClickSell,
    onClickRemove,
    onFooterEntered,
    onMouseEnter,
    onMouseLeave,
    removeToast,
    result,
    setCurrentFocus,
    server_time,
    should_show_transition,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
    toggleUnsupportedContractModal,
}) => {
    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    const loader_el = (
        <div className='dc-contract-card__content-loader'>
            <ContractCard.Loader speed={2} />
        </div>
    );

    const card_header = (
        <ContractCard.Header
            contract_info={contract_info}
            display_name={display_name}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={!is_multiplier}
            is_mobile={is_mobile}
            is_positions={true}
            is_sell_requested={is_sell_requested}
            onClickSell={onClickSell}
            server_time={server_time}
        />
    );

    const card_body = (
        <ContractCard.Body
            addToast={addToast}
            connectWithContractUpdate={connectWithContractUpdate}
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            current_focus={current_focus}
            getCardLabels={getCardLabels}
            getContractById={getContractById}
            is_mobile={is_mobile}
            is_multiplier={is_multiplier}
            removeToast={removeToast}
            server_time={server_time}
            setCurrentFocus={setCurrentFocus}
            should_show_cancellation_warning={should_show_cancellation_warning}
            status={status}
            toggleCancellationWarning={toggleCancellationWarning}
        />
    );

    const card_footer = (
        <ContractCard.Footer
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            is_multiplier={is_multiplier}
            is_positions={true}
            is_sell_requested={is_sell_requested}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            onFooterEntered={onFooterEntered}
            server_time={server_time}
            should_show_transition={should_show_transition}
        />
    );

    const contract_el = (
        <React.Fragment>
            {card_header}
            {card_body}
        </React.Fragment>
    );

    return (
        <ContractCard
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            getContractPath={getContractPath}
            is_multiplier={is_multiplier}
            is_positions={true}
            is_unsupported={is_unsupported}
            onClickRemove={onClickRemove}
            profit_loss={profit_loss}
            result={result}
            should_show_result_overlay={true}
            toggleUnsupportedContractModal={toggleUnsupportedContractModal}
        >
            <div
                id={`dc_contract_card_${contract_info.contract_id}`}
                className={className}
                onMouseEnter={() => {
                    if (typeof onMouseEnter === 'function') onMouseEnter();
                }}
                onMouseLeave={() => {
                    if (typeof onMouseLeave === 'function') onMouseLeave();
                }}
                onClick={() => {
                    if (typeof onMouseLeave === 'function') onMouseLeave();
                }}
            >
                {is_unsupported ? (
                    <div
                        className={classNames('dc-contract-card', {
                            'dc-contract-card--green': !is_multiplier && profit_loss > 0 && !result,
                            'dc-contract-card--red': !is_multiplier && profit_loss < 0 && !result,
                        })}
                        onClick={() => toggleUnsupportedContractModal(true)}
                    >
                        {contract_info.underlying ? contract_el : loader_el}
                    </div>
                ) : is_link_disabled ? (
                    <div
                        className={classNames('dc-contract-card', {
                            'dc-contract-card--green': !is_multiplier && profit_loss > 0 && !result,
                            'dc-contract-card--red': !is_multiplier && profit_loss < 0 && !result,
                        })}
                    >
                        {contract_info.underlying ? contract_el : loader_el}
                    </div>
                ) : (
                    <NavLink
                        className={classNames('dc-contract-card', {
                            'dc-contract-card--green': !is_multiplier && profit_loss > 0 && !result,
                            'dc-contract-card--red': !is_multiplier && profit_loss < 0 && !result,
                        })}
                        to={{
                            pathname: `/contract/${contract_info.contract_id}`,
                            state: {
                                // from_table_row: true,
                            },
                        }}
                    >
                        {contract_info.underlying ? contract_el : loader_el}
                    </NavLink>
                )}
                {card_footer}
            </div>
        </ContractCard>
    );
};

PositionsDrawerCard.propTypes = {
    addToast: PropTypes.func,
    className: PropTypes.string,
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    current_tick: PropTypes.number,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id: PropTypes.number,
    indicative: PropTypes.number,
    is_loading: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    is_unsupported: PropTypes.bool,
    is_valid_to_sell: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClickRemove: PropTypes.func,
    onClickSell: PropTypes.func,
    onClickCancel: PropTypes.func,
    profit_loss: PropTypes.number,
    result: PropTypes.string,
    sell_time: PropTypes.number,
    setCurrentFocus: PropTypes.func,
    status: PropTypes.string,
    toggleUnsupportedContractModal: PropTypes.func,
    type: PropTypes.string,
};

export default connect(({ modules, ui, client, common }) => ({
    currency: client.currency,
    server_time: common.server_time,
    addToast: ui.addToast,
    current_focus: ui.current_focus,
    onClickCancel: modules.portfolio.onClickCancel,
    onClickSell: modules.portfolio.onClickSell,
    onClickRemove: modules.portfolio.removePositionById,
    getContractById: modules.contract_trade.getContractById,
    is_mobile: ui.is_mobile,
    removeToast: ui.removeToast,
    setCurrentFocus: ui.setCurrentFocus,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    toggleCancellationWarning: ui.toggleCancellationWarning,
    toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
}))(PositionsDrawerCard);
