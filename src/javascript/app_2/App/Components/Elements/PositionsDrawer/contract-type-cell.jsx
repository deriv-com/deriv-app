import React                      from 'react';
import PropTypes                  from 'prop-types';
import { getContractTypeDisplay } from 'Constants/contract';
import { IconTradeType }          from 'Assets/Trading/Types';

const ContractTypeCell = ({ type }) => (
    <div className='contract-type'>
        <div className='contract-type__type-wrapper'>
            <IconTradeType type={type.toLowerCase()} className='category-type' />
        </div>
        <span className='contract-type__type-label'>
            {getContractTypeDisplay(type) || ''}
        </span>
    </div>
);

ContractTypeCell.propTypes = {
    type: PropTypes.string,
};

export default ContractTypeCell;
