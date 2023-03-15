import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Collapsible, ContractCard, useHover } from '@deriv/components';
import { isCryptoContract, isDesktop, getEndTime, getSymbolDisplayName } from '@deriv/shared';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { connect } from 'Stores/connect';
import { getMarketInformation } from 'Utils/Helpers/market-underlying';
import { SwipeableContractDrawer } from './swipeable-components.jsx';
import MarketClosedContractOverlay from './market-closed-contract-overlay.jsx';
import { connectWithContractUpdate } from 'Stores/Modules/Trading/Helpers/multiplier';

const ContractDrawerCard = ({
    active_symbols,
    addToast,
    contract_info,
    contract_update,
    currency,
    current_focus,
    getContractById,
    is_market_closed,
    is_mobile,
    is_multiplier,
    is_vanilla,
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
    const [hover_ref, should_hide_closed_overlay] = useHover();

    const { profit, underlying: symbol } = contract_info;
    const is_sold = !!getEndTime(contract_info);
    const display_name = getSymbolDisplayName(active_symbols, getMarketInformation(contract_info.shortcode).underlying);

    const is_crypto = isCryptoContract(contract_info.underlying);
    const has_progress_slider = !is_multiplier || (is_crypto && is_multiplier);

    const card_header = (
        <ContractCard.Header
            contract_info={contract_info}
            display_name={display_name}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={isDesktop() && has_progress_slider}
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
            is_vanilla={is_vanilla}
            has_progress_slider={has_progress_slider}
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
                    'contract-card__market-closed--disabled': is_market_closed && should_hide_closed_overlay,
                })}
                ref={hover_ref}
            >
                {is_market_closed && !getEndTime(contract_info) && (
                    <div
                        className={classNames({
                            'contract-card__market-closed--hidden': isDesktop() && should_hide_closed_overlay,
                        })}
                    >
                        <MarketClosedContractOverlay symbol={symbol} />
                    </div>
                )}
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
                    {(is_sold || is_multiplier || is_vanilla) && (
                        <Collapsible.ArrowButton onClick={toggleContractAuditDrawer} is_collapsed={is_collapsed} />
                    )}
                    {contract_card}
                </SwipeableContractDrawer>
            </MobileWrapper>
        </React.Fragment>
    );
};

ContractDrawerCard.propTypes = {
    active_symbols: PropTypes.array,
    addToast: PropTypes.func,
    contract_info: PropTypes.object,
    contract_update: PropTypes.object,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    getContractById: PropTypes.func,
    is_collapsed: PropTypes.bool,
    is_market_closed: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_vanilla: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
    onSwipedDown: PropTypes.func,
    onSwipedUp: PropTypes.func,
    status: PropTypes.string,
    removeToast: PropTypes.func,
    result: PropTypes.any,
    server_time: PropTypes.object,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    toggleCancellationWarning: PropTypes.func,
    toggleContractAuditDrawer: PropTypes.func,
};

export default connect(({ modules, ui, contract_trade }) => ({
    active_symbols: modules.trade.active_symbols,
    addToast: ui.addToast,
    current_focus: ui.current_focus,
    getContractById: contract_trade.getContractById,
    removeToast: ui.removeToast,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    setCurrentFocus: ui.setCurrentFocus,
    toggleCancellationWarning: ui.toggleCancellationWarning,
}))(ContractDrawerCard);
