import React from 'react';
import { PropTypes } from 'prop-types';

const FlyoutImage = props => {
    const { url } = props;

    return (
        <img src={url} className='flyout__item-img flyout__item' />
    );
};

FlyoutImage.PropTypes = {
    url: PropTypes.string,
};

export default FlyoutImage;
