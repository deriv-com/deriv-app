import React from 'react';
import PropTypes from 'prop-types';
import IconTradeTypes from '../../icon-trade-types';
import { localize } from '@deriv/translations';

const ContractTypeCell = ({ displayed_trade_param, getContractTypeDisplay, is_high_low, type }) => (
    <div className='dc-contract-type'>
        <div className='dc-contract-type__type-wrapper'>
            <IconTradeTypes
                type={is_high_low ? `${type.toLowerCase()}_barrier` : type.toLowerCase()}
                className='category-type'
                size={24}
            />
        </div>
        <div className='dc-contract-type__type-label'>
            {type === 'ACCU' ? localize('Accumulator') : <div>{getContractTypeDisplay(type, is_high_low) || ''}</div>}
            {displayed_trade_param && (
                <div className='dc-contract-type__type-label-trade-param'>{displayed_trade_param}</div>
            )}
        </div>
    </div>
);

ContractTypeCell.propTypes = {
    displayed_trade_param: PropTypes.string,
    getContractTypeDisplay: PropTypes.func,
    is_high_low: PropTypes.bool,
    type: PropTypes.string,
};

export default ContractTypeCell;
