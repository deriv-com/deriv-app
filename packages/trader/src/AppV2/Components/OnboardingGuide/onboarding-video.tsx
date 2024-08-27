import React from 'react';
import { Skeleton } from '@deriv-com/quill-ui';
import { getUrlBase } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const OnboardingVideo = () => {
    const [is_loading, setIsLoading] = React.useState(true);

    // memoize file paths for videos and open the modal only after we get them
    const getVideoSource = React.useCallback(
        (extension: string) => getUrlBase(`/public/videos/user-onboarding-guide-trade-page.${extension}`),
        []
    );
    const mp4_src = React.useMemo(() => getVideoSource('mp4'), [getVideoSource]);

    return (
        <React.Fragment>
            {is_loading && <Skeleton.Square height={218.5} />}
            <video
                autoPlay
                muted
                loop
                onLoadedData={() => setIsLoading(false)}
                playsInline
                preload='auto'
                height={218.5}
            >
                {/* a browser will select a source with extension it recognizes */}
                <source src={mp4_src} type='video/mp4' />
                {<Localize i18n_default_text='Unfortunately, your browser does not support the video.' />}
            </video>
        </React.Fragment>
    );
};

export default OnboardingVideo;
