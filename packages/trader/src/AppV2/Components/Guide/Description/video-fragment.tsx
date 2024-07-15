import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { Loading } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import { getUrlBase } from '@deriv/shared';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import Lottie from 'react-lottie';
// import * as animationData from './lottie/accumulators_lottie_mobile.lottie';
import * as animationData from './lottie/accumulators_lottie_mobile.json';

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

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    const events = {
        DATA_READY: 'data_ready',
        LOOP_COMPLETE: 'loopComplete',
        ENTER_FRAME: 'enterFrame',
        SEGMENT_START: 'segmentStart',
        CONFIG_LOADED: 'config_ready',
    } as const;

    const eventListeners = [
        {
            eventName: events.DATA_READY,
            callback: () => {
                console.log('data is ready');
                setIsLoading(false);
            },
        },
        {
            eventName: events.LOOP_COMPLETE,
            callback: () => console.log('the animation completed'),
        },
        {
            eventName: events.ENTER_FRAME,
            callback: () => console.log('enter frame'),
        },
        {
            eventName: events.SEGMENT_START,
            callback: () => console.log('segmentStart'),
        },
        {
            eventName: events.CONFIG_LOADED,
            callback: () => console.log('config_ready'),
        },
    ];

    return (
        <div
            className={classNames('video-fragment__wrapper', {
                'video-fragment__wrapper--accumulator':
                    contract_type.toLowerCase() === CONTRACT_LIST.ACCUMULATORS.toLowerCase(),
            })}
        >
            {is_loading && <Loading is_fullscreen={false} />}
            <Lottie options={defaultOptions} height={161} width={248} eventListeners={eventListeners} />
        </div>
    );
};

export default VideoFragment;
