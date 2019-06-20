import React                      from 'react';
import PropTypes                  from 'prop-types';
import { getContractTypeDisplay } from 'Constants/contract';
import Icon                       from 'Assets/icon.jsx';

const ContractTypeCell = ({ type }) => (
    <div className='contract-type'>
        <div className='contract-type__type-wrapper'>
            <Icon icon='IconTradeType' type={type.toLowerCase()} className='category-type' />
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
