import React from 'react';
import { PropTypes } from 'prop-types';

const FlyoutVideo = (props) => {
    return (
        <iframe
            className='flyout__help-video flyout__item'
            src={props.url}
            frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            height='200px'
            allowFullScreen
            width={'100%'}
        />
    );

};

FlyoutVideo.propTypes = {
    url: PropTypes.string,
};

export default FlyoutVideo;
