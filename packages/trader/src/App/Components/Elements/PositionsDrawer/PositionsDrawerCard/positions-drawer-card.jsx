import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import CurrencyBadge from 'App/Components/Elements/currency-badge.jsx';
import { ContractCard, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { getContractPath, isMultiplierContract } from '@deriv/shared';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { connect } from 'Stores/connect';
import { connectWithContractUpdate } from 'Stores/Modules/Contract/Helpers/multiplier';

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
    setCurrentFocus,
    server_time,
    should_show_cancellation_warning,
    show_transition,
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
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            getCardLabels={getCardLabels}
            is_mobile={is_mobile}
            is_multiplier={is_multiplier}
            status={status}
            server_time={server_time}
        />
    );

    const card_body_wrapper = (
        <React.Fragment>
            <DesktopWrapper>{card_body}</DesktopWrapper>
            <MobileWrapper>
                <div
                    className={
                        ('dc-contract-card__separatorclass',
                        classNames({
                            'dc-contract-card__body-wrapper': !is_multiplier,
                        }))
                    }
                >
                    {card_body}
                </div>
            </MobileWrapper>
        </React.Fragment>
    );

    const card_footer = (
        <ContractCard.Footer
            addToast={addToast}
            connectWithContractUpdate={connectWithContractUpdate}
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            getContractById={getContractById}
            is_multiplier={is_multiplier}
            is_positions={true}
            is_sell_requested={is_sell_requested}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            removeToast={removeToast}
            setCurrentFocus={setCurrentFocus}
            server_time={server_time}
            should_show_cancellation_warning={should_show_cancellation_warning}
            status={status}
            toggleCancellationWarning={toggleCancellationWarning}
        />
    );

    const contract_el = (
        <React.Fragment>
            {card_header}
            <CurrencyBadge currency={currency} />
            {card_body_wrapper}
        </React.Fragment>
    );

    // When scrolling fast in react-window, sometimes card is stuck with enter transition class and it is not removed after timeout making the card to be invisible.
    // So added a class based on isScrolling from react-window to show the transition.
    const transition_class = show_transition && 'dc-contract-card__wrapper--transition';

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
                className={classNames('dc-contract-card__wrapper', transition_class, className)}
                onMouseEnter={() => {
                    if (typeof onMouseEnter === 'function') onMouseEnter(true, contract_info);
                }}
                onMouseLeave={() => {
                    if (typeof onMouseLeave === 'function') onMouseLeave(false, contract_info);
                }}
                onClick={() => {
                    if (typeof onMouseLeave === 'function') onMouseLeave(false, contract_info);
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
    setCurrentFocus: PropTypes.func,
    status: PropTypes.string,
    toggleUnsupportedContractModal: PropTypes.func,
    type: PropTypes.string,
};

export default connect(({ modules, ui }) => ({
    addToast: ui.addToast,
    getContractById: modules.contract_trade.getContractById,
    is_mobile: ui.is_mobile,
    removeToast: ui.removeToast,
    setCurrentFocus: ui.setCurrentFocus,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    toggleCancellationWarning: ui.toggleCancellationWarning,
}))(PositionsDrawerCard);
