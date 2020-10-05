import PropTypes from 'prop-types';
import React from 'react';

const Card = ({ children, width }) => (
    <div
        className='carousel__card'
        style={{
            width: width,
        }}
    >
        {children}
    </div>
);

Card.propTypes = {
    item: PropTypes.object,
};

export default Card;
