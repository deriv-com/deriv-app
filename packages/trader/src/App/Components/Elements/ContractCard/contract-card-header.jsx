import PropTypes from 'prop-types';
import React     from 'react';

const ContractCardHeader = ({ children }) => (
    <div className='contract-card__header'>
        {children}
    </div>
);

ContractCardHeader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default ContractCardHeader;
