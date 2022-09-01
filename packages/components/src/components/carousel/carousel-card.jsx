import PropTypes from 'prop-types';
import React from 'react';

const Card = ({ children, width }) => (
    <div
        className='dc-carousel__card'
        style={{
            width: `${width}px`,
        }}
    >
        {children}
    </div>
);

Card.propTypes = {
    width: PropTypes.number,
};

export default Card;
