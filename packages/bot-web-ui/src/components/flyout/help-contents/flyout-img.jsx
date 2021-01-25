import React from 'react';
import { PropTypes } from 'prop-types';

const FlyoutImage = props => {
    const { width, url } = props;
    const style = { width };

    return (
        <div className='flyout__item'>
            <img src={url} className='flyout__image' style={style} />
        </div>
    );
};

FlyoutImage.propTypes = {
    url: PropTypes.string,
};

export default FlyoutImage;
