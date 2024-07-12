import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { Loading } from '@deriv-lib/components';
import { Text } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import { getUrlBase } from '@deriv/shared';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';

type TVideoFragment = {
    contract_type: string;
};
const VideoFragment = ({ contract_type }: TVideoFragment) => {
    const [is_loading, setIsLoading] = React.useState(true);

    const { isMobile } = useDevice();

    // memoize file paths for videos and open the modal only after we get them
    const getVideoSource = React.useCallback(
        (extension: string) =>
            getUrlBase(`/public/videos/${contract_type.toLowerCase()}_${isMobile ? 'mobile' : 'desktop'}.${extension}`),
        [contract_type, isMobile]
    );
    const mp4_src = React.useMemo(() => getVideoSource('mp4'), [getVideoSource]);

    return (
        <div
            className={classNames('video-fragment__wrapper', {
                'video-fragment__wrapper--accumulator':
                    contract_type.toLowerCase() === CONTRACT_LIST.ACCUMULATORS.toLowerCase(),
            })}
        >
            {is_loading && <Loading is_fullscreen={false} />}
            <video
                autoPlay
                className='video-fragment'
                data-testid='dt_video_fragment'
                loop
                onLoadedData={() => setIsLoading(false)}
                playsInline
                preload='auto'
                muted
            >
                {/* a browser will select a source with extension it recognizes */}
                <source src={mp4_src} type='video/mp4' />
                <Text size='sm'>
                    <Localize i18n_default_text='Unfortunately, your browser does not support the video.' />
                </Text>
            </video>
        </div>
    );
};

export default VideoFragment;
