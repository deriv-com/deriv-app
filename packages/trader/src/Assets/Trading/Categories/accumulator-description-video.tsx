import React from 'react';
import { localize } from '@deriv/translations';
import { Loading } from '@deriv/components';
import { getUrlBase } from '@deriv/shared';

const AccumulatorDescriptionVideo = () => {
    const [is_loading, setIsLoading] = React.useState(true);
    const getVideoSource = (extension: 'mp4' | 'webm') => {
        return getUrlBase(`/public/images/common/accumulator_description.${extension}`);
    };
    // memoize file paths for videos and open the modal only after we get them
    const mp4_src = React.useMemo(() => getVideoSource('mp4'), []);
    const webm_src = React.useMemo(() => getVideoSource('webm'), []);

    return (
        <div className='accumulator-description-video'>
            {is_loading && <Loading is_fullscreen={false} />}
            <video
                autoPlay
                loop
                onLoadedData={() => setIsLoading(false)}
                playsInline
                preload='auto'
                controls
                width={328}
                height={164}
            >
                {/* a browser will select a source with extension it recognizes */}
                <source src={mp4_src} type='video/mp4' />
                <source src={webm_src} type='video/webm' />
                {localize('Unfortunately, your browser does not support the video.')}
            </video>
        </div>
    );
};

export default React.memo(AccumulatorDescriptionVideo);
