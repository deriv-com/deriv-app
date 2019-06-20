import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';
import SellButton   from '../Components/Sell/sell-button.jsx';

const ContractSell = ({
    contract_info,
    is_sell_requested,
    is_valid_to_sell,
    onClickSell,
}) => contract_info.tick_count ? null : ( // Sell is not available for tick contracts
    <div className='sell'>
        <SellButton
            contract_info={contract_info}
            is_sell_requested={is_sell_requested}
            is_valid_to_sell={is_valid_to_sell}
            onClickSell={onClickSell}
        />
    </div>
);

ContractSell.propTypes = {
    contract_info    : PropTypes.object,
    is_sell_requested: PropTypes.bool,
    is_valid_to_sell : PropTypes.bool,
    onClickSell      : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        contract_info    : modules.contract.contract_info,
        is_sell_requested: modules.contract.is_sell_requested,
        is_valid_to_sell : modules.contract.is_valid_to_sell,
        onClickSell      : modules.contract.onClickSell,
    })
)(ContractSell);
