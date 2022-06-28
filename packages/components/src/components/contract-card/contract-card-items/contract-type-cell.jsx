import React from 'react';
import PropTypes from 'prop-types';
import IconTradeTypes from '../../icon-trade-types';

const ContractTypeCell = ({ getContractTypeDisplay, growth_rate, is_high_low, multiplier, type }) => (
    <div className='dc-contract-type'>
        <div className='dc-contract-type__type-wrapper'>
            <IconTradeTypes
                type={is_high_low ? `${type.toLowerCase()}_barrier` : type.toLowerCase()}
                className='category-type'
                size={24}
            />
        </div>
        <div className='dc-contract-type__type-label'>
            <div>{(growth_rate && 'Accumulate') || getContractTypeDisplay(type, is_high_low) || ''}</div>
            {(multiplier || growth_rate) && (
                <div className='dc-contract-type__type-label-parameter'>
                    {multiplier ? `x${multiplier}` : `${growth_rate * 100}%`}
                </div>
            )}
        </div>
    </div>
);

ContractTypeCell.propTypes = {
    getContractTypeDisplay: PropTypes.func,
    is_high_low: PropTypes.bool,
    multiplier: PropTypes.number,
    type: PropTypes.string,
};

export default ContractTypeCell;
