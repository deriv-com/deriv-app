import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Collapsible, ContractCard, useHover } from '@deriv/components';
import { isCryptoContract, isDesktop, getEndTime, getSymbolDisplayName } from '@deriv/shared';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { getMarketInformation } from 'Utils/Helpers/market-underlying';
import { SwipeableContractDrawer } from './swipeable-components.jsx';
import MarketClosedContractOverlay from './market-closed-contract-overlay.jsx';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const ContractDrawerCard = observer(
    ({
        contract_info,
        contract_update,
        currency,
        is_accumulator,
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
        result,
        server_time,
        status,
        toggleContractAuditDrawer,
    }) => {
        const { ui, contract_trade } = useStore();
        const { active_symbols } = useTraderStore();
        const {
            addToast,
            current_focus,
            removeToast,
            should_show_cancellation_warning,
            setCurrentFocus,
            toggleCancellationWarning,
        } = ui;
        const { getContractById } = contract_trade;
        const [hover_ref, should_hide_closed_overlay] = useHover();

        const { profit, underlying: symbol } = contract_info;
        const is_sold = !!getEndTime(contract_info);
        const display_name = getSymbolDisplayName(
            active_symbols,
            getMarketInformation(contract_info.shortcode).underlying
        );

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
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                current_focus={current_focus}
                getCardLabels={getCardLabels}
                getContractById={getContractById}
                is_accumulator={is_accumulator}
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

        const has_swipeable_drawer = is_sold || is_multiplier || is_accumulator || is_vanilla;

        return (
            <React.Fragment>
                <DesktopWrapper>{contract_card}</DesktopWrapper>
                <MobileWrapper>
                    <SwipeableContractDrawer
                        onSwipedUp={has_swipeable_drawer ? onSwipedUp : undefined}
                        onSwipedDown={has_swipeable_drawer ? onSwipedDown : undefined}
                    >
                        {has_swipeable_drawer && (
                            <Collapsible.ArrowButton onClick={toggleContractAuditDrawer} is_collapsed={is_collapsed} />
                        )}
                        {contract_card}
                    </SwipeableContractDrawer>
                </MobileWrapper>
            </React.Fragment>
        );
    }
);

ContractDrawerCard.propTypes = {
    currency: PropTypes.string,
    is_accumulator: PropTypes.bool,
    is_collapsed: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
};
export default ContractDrawerCard;
