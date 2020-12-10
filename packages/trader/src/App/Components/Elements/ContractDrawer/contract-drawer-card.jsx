import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Collapsible, ContractCard } from '@deriv/components';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { getEndTime } from 'Stores/Modules/Contract/Helpers/logic';
import { connect } from 'Stores/connect';
import { getSymbolDisplayName } from 'Stores/Modules/Trading/Helpers/active-symbols';
import { connectWithContractUpdate } from 'Stores/Modules/Contract/Helpers/multiplier';
import { getMarketInformation } from 'Modules/Reports/Helpers/market-underlying';
import { SwipeableContractDrawer } from './swipeable-components.jsx';

const ContractDrawerCard = ({
    active_symbols,
    addToast,
    contract_info,
    contract_update,
    currency,
    current_focus,
    getContractById,
    is_mobile,
    is_multiplier,
    is_sell_requested,
    is_collapsed,
    onClickCancel,
    onClickSell,
    onSwipedUp,
    onSwipedDown,
    removeToast,
    result,
    setCurrentFocus,
    server_time,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
    toggleContractAuditDrawer,
}) => {
    const { profit } = contract_info;
    const is_sold = !!getEndTime(contract_info);
    const display_name = getSymbolDisplayName(active_symbols, getMarketInformation(contract_info.shortcode).underlying);

    const card_header = (
        <ContractCard.Header
            contract_info={contract_info}
            display_name={display_name}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={!is_multiplier}
            is_mobile={is_mobile}
            is_sell_requested={is_sell_requested}
            is_sold={is_sold}
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
            is_sold={is_sold}
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
            is_sell_requested={is_sell_requested}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            server_time={server_time}
            status={status}
        />
    );

    const contract_el = (
        <React.Fragment>
            {card_header}
            {card_body}
        </React.Fragment>
    );

    const contract_card = (
        <ContractCard
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            is_multiplier={is_multiplier}
            profit_loss={profit}
            should_show_result_overlay={false}
        >
            <div
                className={classNames('dc-contract-card', {
                    'dc-contract-card--green': is_mobile && !is_multiplier && profit > 0 && !result,
                    'dc-contract-card--red': is_mobile && !is_multiplier && profit < 0 && !result,
                })}
            >
                {contract_el}
                {card_footer}
            </div>
        </ContractCard>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>{contract_card}</DesktopWrapper>
            <MobileWrapper>
                <SwipeableContractDrawer
                    onSwipedUp={is_sold || is_multiplier ? onSwipedUp : undefined}
                    onSwipedDown={is_sold || is_multiplier ? onSwipedDown : undefined}
                >
                    {(is_sold || is_multiplier) && (
                        <Collapsible.ArrowButton onClick={toggleContractAuditDrawer} is_collapsed={is_collapsed} />
                    )}
                    {contract_card}
                </SwipeableContractDrawer>
            </MobileWrapper>
        </React.Fragment>
    );
};

ContractDrawerCard.propTypes = {
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    is_multiplier: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
    status: PropTypes.string,
};

export default connect(({ modules, ui }) => ({
    active_symbols: modules.trade.active_symbols,
    addToast: ui.addToast,
    current_focus: ui.current_focus,
    getContractById: modules.contract_trade.getContractById,
    removeToast: ui.removeToast,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    setCurrentFocus: ui.setCurrentFocus,
    toggleCancellationWarning: ui.toggleCancellationWarning,
}))(ContractDrawerCard);
