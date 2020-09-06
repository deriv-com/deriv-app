import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Collapsible, ContractCard } from '@deriv/components';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { getEndTime } from 'Stores/Modules/Contract/Helpers/logic';
import { connect } from 'Stores/connect';
import { SwipeableContractDrawer } from './swipeable-components.jsx';

const ContractDrawerCard = ({
    addToast,
    contract_info,
    contract_update,
    currency,
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
    server_time,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
    toggleContractAuditDrawer,
    updateLimitOrder,
}) => {
    const { profit } = contract_info;
    const is_sold = !!getEndTime(contract_info);

    const contract_card = (
        <ContractCard
            addToast={addToast}
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            getCardLabels={getCardLabels}
            getContractById={getContractById}
            getContractTypeDisplay={getContractTypeDisplay}
            is_mobile={is_mobile}
            is_multiplier={is_multiplier}
            is_positions={false}
            is_sell_requested={is_sell_requested}
            is_sold={is_sold}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            profit_loss={profit}
            removeToast={removeToast}
            server_time={server_time}
            should_show_cancellation_warning={should_show_cancellation_warning}
            should_show_profit_loss_overlay={is_mobile}
            should_show_result_overlay={false}
            status={status}
            toggleCancellationWarning={toggleCancellationWarning}
            updateLimitOrder={updateLimitOrder}
        />
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
    is_multiplier: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
    status: PropTypes.string,
};

export default connect(({ modules, ui }) => ({
    addToast: ui.addToast,
    getContractById: modules.contract_trade.getContractById,
    removeToast: ui.removeToast,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    toggleCancellationWarning: ui.toggleCancellationWarning,
    updateLimitOrder: modules.contract_trade.updateLimitOrder,
}))(ContractDrawerCard);
