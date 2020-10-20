import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CurrencyBadge from 'App/Components/Elements/currency-badge.jsx';
import { DesktopWrapper, MobileWrapper, Collapsible, ContractCard } from '@deriv/components';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { getEndTime } from 'Stores/Modules/Contract/Helpers/logic';
import { connect } from 'Stores/connect';
import { connectWithContractUpdate } from 'Stores/Modules/Contract/Helpers/multiplier';
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

    const card_header = (
        <ContractCard.Header
            contract_info={contract_info}
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
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            getCardLabels={getCardLabels}
            is_mobile={is_mobile}
            is_multiplier={is_multiplier}
            is_sold={is_sold}
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
            <CurrencyBadge currency={contract_info?.currency ?? ''} />
            {card_body_wrapper}
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
    setCurrentFocus: ui.setCurrentFocus,
    toggleCancellationWarning: ui.toggleCancellationWarning,
}))(ContractDrawerCard);
