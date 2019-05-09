import PropTypes from 'prop-types';
import React     from 'react';

const ContractCardFooter = ({ children }) => (
    <div className='contract-card__footer'>
        {children}
    </div>
);

ContractCardFooter.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
};

export default ContractCardFooter;
