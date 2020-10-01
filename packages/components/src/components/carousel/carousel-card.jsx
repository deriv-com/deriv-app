import PropTypes from 'prop-types';
import React from 'react';

const Card = ({ children }) => <div className='carousel__card'>{children}</div>;

Card.propTypes = {
    item: PropTypes.object,
};

export default Card;
