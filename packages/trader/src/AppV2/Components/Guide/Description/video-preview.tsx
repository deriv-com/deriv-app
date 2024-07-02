import React from 'react';
import { getDescriptionVideoId } from 'Modules/Trading/Helpers/video-config';
import { Stream } from '@cloudflare/stream-react';

const VideoPreview = () => {
    return (
        <div className='guide__video-placeholder'>
            <Stream
                autoplay={false}
                controls={false}
                height='205.8px'
                letterboxColor='transparent'
                muted
                preload='auto'
                responsive={false}
                src={getDescriptionVideoId('accumulator', false)}
                width='90%'
            />
        </div>
    );
};

export default VideoPreview;
