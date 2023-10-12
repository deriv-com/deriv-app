import React from 'react';

const FlyoutVideo = (props: { url: string }) => (
    <div className='flyout__item' data-testid='dt_flyout_video_container'>
        <iframe
            data-testid='dt_flyout_video'
            className='flyout__video'
            src={props.url}
            frameBorder='0'
            allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            width='100%'
        />
    </div>
);

export default FlyoutVideo;
