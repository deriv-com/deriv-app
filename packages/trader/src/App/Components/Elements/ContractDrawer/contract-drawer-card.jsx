import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Collapsible } from '@deriv/components';
import ContractCard from 'App/Components/Elements/ContractCard';
import CardBody from './contract-drawer-card-body.jsx';
import CardFooter from './contract-drawer-card-footer.jsx';
import CardHeader from './contract-drawer-card-header.jsx';
import { SwipeableContractDrawer } from './swipeable-components.jsx';

const ContractDrawerCard = ({
    contract_info,
    currency,
    is_multiplier,
    is_sell_requested,
    is_collapsed,
    onClickCancel,
    onClickSell,
    onSwipedUp,
    onSwipedDown,
    status,
    toggleContractAuditDrawer,
}) => {
    const { is_sold, profit } = contract_info;

    const card_body = (
        <CardBody contract_info={contract_info} currency={currency} is_multiplier={is_multiplier} status={status} />
    );

    const card_body_wrapper = (
        <React.Fragment>
            <DesktopWrapper>{card_body}</DesktopWrapper>
            <MobileWrapper>
                <div className='contract-card__body-wrapper contract-card__separator'>{card_body}</div>
            </MobileWrapper>
        </React.Fragment>
    );

    const contract_card = (
        <ContractCard contract_info={contract_info} profit_loss={profit} is_sold={!!is_sold}>
            <CardHeader contract_info={contract_info} has_progress_slider={!is_multiplier} />
            {card_body_wrapper}
            <CardFooter
                contract_info={contract_info}
                is_multiplier={is_multiplier}
                is_sell_requested={is_sell_requested}
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
            />
        </ContractCard>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>{contract_card}</DesktopWrapper>
            <MobileWrapper>
                <SwipeableContractDrawer
                    onSwipedUp={is_sold ? onSwipedUp : undefined}
                    onSwipedDown={is_sold ? onSwipedDown : undefined}
                >
                    {!!is_sold && (
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
