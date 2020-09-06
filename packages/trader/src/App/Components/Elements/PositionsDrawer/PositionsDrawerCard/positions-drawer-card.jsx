import PropTypes from 'prop-types';
import React from 'react';
import { ContractCard } from '@deriv/components';
import { getContractPath, isMultiplierContract } from '@deriv/shared';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { connect } from 'Stores/connect';

const PositionsDrawerCard = ({
    addToast,
    className,
    contract_info,
    contract_update,
    currency,
    getContractById,
    is_mobile,
    is_sell_requested,
    is_unsupported,
    is_link_disabled,
    profit_loss,
    onClickCancel,
    onClickSell,
    onClickRemove,
    onMouseEnter,
    onMouseLeave,
    removeToast,
    result,
    server_time,
    should_show_cancellation_warning,
    show_transition,
    status,
    toggleCancellationWarning,
    toggleUnsupportedContractModal,
    updateLimitOrder,
}) => {
    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    return (
        <ContractCard
            addToast={addToast}
            className={className}
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            getCardLabels={getCardLabels}
            getContractById={getContractById}
            getContractPath={getContractPath}
            getContractTypeDisplay={getContractTypeDisplay}
            is_link_disabled={is_link_disabled}
            is_multiplier={is_multiplier}
            is_mobile={is_mobile}
            is_positions={true}
            is_sell_requested={is_sell_requested}
            is_unsupported={is_unsupported}
            onClickCancel={onClickCancel}
            onClickRemove={onClickRemove}
            onClickSell={onClickSell}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            profit_loss={profit_loss}
            removeToast={removeToast}
            result={result}
            server_time={server_time}
            should_show_cancellation_warning={should_show_cancellation_warning}
            should_show_result_overlay={true}
            show_transition={show_transition}
            status={status}
            toggleCancellationWarning={toggleCancellationWarning}
            toggleUnsupportedContractModal={toggleUnsupportedContractModal}
            updateLimitOrder={updateLimitOrder}
        />
    );
};

PositionsDrawerCard.propTypes = {
    className: PropTypes.string,
    contract_info: PropTypes.object,
    currency: PropTypes.string,
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
    profit_loss: PropTypes.number,
    result: PropTypes.string,
    sell_time: PropTypes.number,
    status: PropTypes.string,
    toggleUnsupportedContractModal: PropTypes.func,
    type: PropTypes.string,
};

export default connect(({ modules, ui }) => ({
    toggleCancellationWarning: ui.toggleCancellationWarning,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    getContractById: modules.contract_trade.getContractById,
    addToast: ui.addToast,
    is_mobile: ui.is_mobile,
    removeToast: ui.removeToast,
    updateLimitOrder: modules.contract_trade.updateLimitOrder,
}))(PositionsDrawerCard);
