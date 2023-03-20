import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import ContractCard from '../contract-card';
import {
    getContractPath,
    isCryptoContract,
    isMultiplierContract,
    getCardLabels,
    getContractTypeDisplay,
    getEndTime,
    isVanillaContract,
} from '@deriv/shared';

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
    const is_vanilla = isVanillaContract(contract_info.contract_type);
    const is_crypto = isCryptoContract(contract_info.underlying);
    const has_progress_slider = !is_multiplier || (is_crypto && is_multiplier);
    const has_ended = !!getEndTime(contract_info);

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
            has_progress_slider={!is_mobile && has_progress_slider}
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
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            current_focus={current_focus}
            getCardLabels={getCardLabels}
            getContractById={getContractById}
            onMouseLeave={() => {
                if (typeof onMouseLeave === 'function') onMouseLeave();
            }}
            is_mobile={is_mobile}
            is_multiplier={is_multiplier}
            is_sold={has_ended}
            is_vanilla={is_vanilla}
            has_progress_slider={is_mobile && has_progress_slider}
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

    const supported_contract_card = (
        <div
            className={classNames('dc-contract-card', {
                'dc-contract-card--green': !is_multiplier && profit_loss > 0 && !result,
                'dc-contract-card--red': !is_multiplier && profit_loss < 0 && !result,
            })}
            onClick={() => toggleUnsupportedContractModal(true)}
        >
            {contract_info.underlying ? contract_el : loader_el}
        </div>
    );

    const unsupported_contract_card = is_link_disabled ? (
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
            }}
        >
            {contract_info.underlying ? contract_el : loader_el}
        </NavLink>
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
                {is_unsupported ? supported_contract_card : unsupported_contract_card}
                {card_footer}
            </div>
        </ContractCard>
    );
};

PositionsDrawerCard.propTypes = {
    addToast: PropTypes.func,
    className: PropTypes.string,
    contract_info: PropTypes.object,
    contract_update: PropTypes.object,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    current_tick: PropTypes.number,
    display_name: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    getContractById: PropTypes.func,
    id: PropTypes.number,
    indicative: PropTypes.number,
    is_link_disabled: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    is_unsupported: PropTypes.bool,
    is_valid_to_sell: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClickRemove: PropTypes.func,
    onClickSell: PropTypes.func,
    onClickCancel: PropTypes.func,
    onFooterEntered: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    profit_loss: PropTypes.number,
    removeToast: PropTypes.func,
    result: PropTypes.string,
    sell_time: PropTypes.number,
    server_time: PropTypes.object,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    should_show_transition: PropTypes.bool,
    status: PropTypes.string,
    toggleCancellationWarning: PropTypes.func,
    toggleUnsupportedContractModal: PropTypes.func,
    type: PropTypes.string,
};

export default PositionsDrawerCard;
