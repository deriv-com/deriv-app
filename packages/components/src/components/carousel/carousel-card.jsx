import PropTypes from 'prop-types';
import React from 'react';

const Card = ({ children, width }) => (
    <div
        className='dc-carousel__card'
        style={{
            width,
        }}
    >
        {children}
    </div>
);

Card.propTypes = {
    item: PropTypes.object,
};

export default Card;
