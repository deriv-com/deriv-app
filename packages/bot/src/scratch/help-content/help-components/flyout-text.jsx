import React from 'react';
import { PropTypes } from 'prop-types';

const FlyoutText = props => {
    const { text } = props;

    return (
        <p className='flyout__item'>{text}</p>
    );
};

FlyoutText.PropTypes = {
    text: PropTypes.string,
};

export default FlyoutText;
