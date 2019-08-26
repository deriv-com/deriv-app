import React from 'react';
import { PropTypes } from 'prop-types';

const FlyoutVideo = (props) => {
    return (
        <div className='flyout__item'>
            <iframe
                className='flyout__video'
                src={props.url}
                frameBorder='0'
                allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                width={'100%'}
            />
        </div>
    );

};

FlyoutVideo.propTypes = {
    url: PropTypes.string,
};

export default FlyoutVideo;
