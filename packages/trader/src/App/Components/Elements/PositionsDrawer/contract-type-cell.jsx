import React                      from 'react';
import PropTypes                  from 'prop-types';
import { Icon }                   from 'deriv-components';
import { getContractTypeDisplay } from 'Constants/contract';

const ContractTypeCell = ({ type, is_high_low }) => (
    <div className='contract-type'>
        <div className='contract-type__type-wrapper'>
            <Icon
                icon={`IcTradetype-${(is_high_low) ? `${type.toLowerCase()}Barrier` : type.toLowerCase()}`}
                className='category-type'
                color
            />
        </div>
        <span className='contract-type__type-label'>
            {getContractTypeDisplay(type, is_high_low) || ''}
        </span>
    </div>
);

ContractTypeCell.propTypes = {
    type: PropTypes.string,
};

export default ContractTypeCell;
