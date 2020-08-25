import PropTypes from 'prop-types';
import React from 'react';
import { ContractCard } from '@deriv/components';
import { getContractPath, isMultiplierContract } from '@deriv/shared';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import CardFooter from './positions-drawer-card-footer.jsx';

const PositionsDrawerCard = ({
    className,
    contract_info,
    contract_update,
    currency,
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
    result,
    server_time,
    show_transition,
    status,
    toggleUnsupportedContractModal,
}) => {
    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    const card_footer = (
        <CardFooter
            contract_info={contract_info}
            is_multiplier={is_multiplier}
            is_sell_requested={is_sell_requested}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
        />
    );

    return (
        <ContractCard
            card_footer={card_footer}
            className={className}
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            getCardLabels={getCardLabels}
            getContractPath={getContractPath}
            getContractTypeDisplay={getContractTypeDisplay}
            is_link_disabled={is_link_disabled}
            is_multiplier={is_multiplier}
            is_mobile={is_mobile}
            is_positions={true}
            is_unsupported={is_unsupported}
            onClickRemove={onClickRemove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            profit_loss={profit_loss}
            result={result}
            server_time={server_time}
            should_show_result_overlay={true}
            show_transition={show_transition}
            status={status}
            toggleUnsupportedContractModal={toggleUnsupportedContractModal}
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

export default PositionsDrawerCard;
