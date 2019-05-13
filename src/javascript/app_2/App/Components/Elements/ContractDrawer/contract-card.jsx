import PropTypes from 'prop-types';
import React     from 'react';

const ContractCard = ({ children }) => (
    <div className='contract-card'>
        {children}
    </div>
);

ContractCard.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
};

export default ContractCard;
