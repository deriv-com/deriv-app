import React from 'react';
import { PropTypes } from 'prop-types';

const FlyoutImage = props => {
    const { url } = props;

    return (
        <div className='flyout__item'>
            <img src={url} className='flyout__image' />
        </div>
    );
};

FlyoutImage.propTypes = {
    url: PropTypes.string,
};

export default FlyoutImage;
