import IconTradeTypes from '../../icon-trade-types';
import PropTypes from 'prop-types';
import React from 'react';
import { isVanillaContract } from '@deriv/shared';

const ContractTypeCell = ({ displayed_trade_param, getContractTypeDisplay, is_high_low, type, is_open_positions }) => (
    <div className='dc-contract-type'>
        <div className='dc-contract-type__type-wrapper'>
            <IconTradeTypes
                type={is_high_low && !isVanillaContract(type) ? `${type.toLowerCase()}_barrier` : type.toLowerCase()}
                className='category-type'
                size={24}
            />
        </div>
        <div className='dc-contract-type__type-label'>
            {!is_open_positions && displayed_trade_param && (
                <React.Fragment>
                    <div>{getContractTypeDisplay(type, is_high_low) || ''}</div>
                    <div className='dc-contract-type__type-label-trade-param'>{displayed_trade_param}</div>
                </React.Fragment>
            )}
        </div>
    </div>
);

ContractTypeCell.propTypes = {
    displayed_trade_param: PropTypes.string,
    getContractTypeDisplay: PropTypes.func,
    is_high_low: PropTypes.bool,
    type: PropTypes.string,
    is_open_positions: PropTypes.bool,
};

export default ContractTypeCell;
