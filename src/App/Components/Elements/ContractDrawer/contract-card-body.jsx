import PropTypes from 'prop-types';
import React     from 'react';

const ContractCardBody = ({ children }) => (
    <div className='contract-card__body'>
        {children}
    </div>
);

ContractCardBody.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default ContractCardBody;
