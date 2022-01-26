import React from 'react';

type FlyoutVideoProps = {
    url: string;
};

const FlyoutVideo = (props: FlyoutVideoProps) => {
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

export default FlyoutVideo;
