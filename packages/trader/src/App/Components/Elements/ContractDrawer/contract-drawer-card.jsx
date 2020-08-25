import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Collapsible, ContractCard } from '@deriv/components';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { getEndTime } from 'Stores/Modules/Contract/Helpers/logic';
import CardFooter from './contract-drawer-card-footer.jsx';
import { SwipeableContractDrawer } from './swipeable-components.jsx';

const ContractDrawerCard = ({
    contract_info,
    contract_update,
    currency,
    is_mobile,
    is_multiplier,
    is_sell_requested,
    is_collapsed,
    onClickCancel,
    onClickSell,
    onSwipedUp,
    onSwipedDown,
    server_time,
    status,
    toggleContractAuditDrawer,
}) => {
    const { profit } = contract_info;
    const is_sold = !!getEndTime(contract_info);

    const card_footer = (
        <CardFooter
            contract_info={contract_info}
            is_multiplier={is_multiplier}
            is_sell_requested={is_sell_requested}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
        />
    );

    const contract_card = (
        <ContractCard
            card_footer={card_footer}
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            is_mobile={is_mobile}
            is_multiplier={is_multiplier}
            is_positions={false}
            is_sold={is_sold}
            profit_loss={profit}
            server_time={server_time}
            should_show_result_overlay={false}
            status={status}
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

export default ContractDrawerCard;
