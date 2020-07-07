import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Collapsible, ContractCard } from '@deriv/components';
import { SwipeableContractDrawer } from './swipeable-components.jsx';
import { card_labels, getContractTypeDisplay } from '../../../../Constants/contract';
import CardFooter from './contract-drawer-card-footer.jsx';
import { getContractPath } from '@deriv/shared/utils/route';

const ContractDrawerCard = ({
    contract_info,
    contract_update,
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

    const contract_card = (
        <ContractCard
            card_labels={card_labels}
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            getContractPath={getContractPath}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={!is_multiplier}
            is_multiplier={is_multiplier}
            is_positions={false}
            is_sold={!!is_sold}
            profit_loss={profit}
            status={status}
        >
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
