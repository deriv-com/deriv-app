import PropTypes from 'prop-types';
import React from 'react';
import ContractCard from 'App/Components/Elements/ContractCard';
import CardBody from './contract-drawer-card-body.jsx';
import CardFooter from './contract-drawer-card-footer.jsx';
import CardHeader from './contract-drawer-card-header.jsx';

const ContractDrawerCard = ({
    contract_info,
    currency,
    is_multiplier,
    is_sell_requested,
    onClickCancel,
    onClickSell,
    status,
}) => {
    const { is_sold, profit } = contract_info;

    return (
        <ContractCard profit_loss={profit} is_sold={!!is_sold}>
            <CardHeader contract_info={contract_info} has_progress_slider={!is_multiplier} />
            <CardBody contract_info={contract_info} currency={currency} is_multiplier={is_multiplier} status={status} />
            <CardFooter
                contract_info={contract_info}
                is_multiplier={is_multiplier}
                is_sell_requested={is_sell_requested}
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
            />
        </ContractCard>
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
