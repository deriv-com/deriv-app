import React from 'react';
import classNames from 'classnames';
import { Loading } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { getUrlBase } from '@deriv/shared';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type TVideoFragment = {
    contract_type: string;
};

const VideoFragment = ({ contract_type }: TVideoFragment) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [dotLottie, setDotLottie] = React.useState<EventTarget | null>(null);

    const { isMobile } = useDevice();

    // memoize file paths for videos and open the modal only after we get them
    const getVideoSource = React.useCallback(
        (extension: string) =>
            getUrlBase(`/public/videos/${contract_type.toLowerCase()}_${isMobile ? 'mobile' : 'desktop'}.${extension}`),
        [contract_type, isMobile]
    );
    const lottie_src = React.useMemo(() => getVideoSource('lottie'), [getVideoSource]);

    React.useEffect(() => {
        const onLoad = () => {
            setIsLoading(false);
        };

        if (dotLottie) {
            dotLottie.addEventListener('load', onLoad);
        }

        return () => {
            if (dotLottie) {
                dotLottie.removeEventListener('load', onLoad);
            }
        };
    }, [dotLottie]);

    const dotLottieRefCallback = (dotLottie: EventTarget | null) => {
        setDotLottie(dotLottie);
    };

    return (
        <div
            className={classNames('video-fragment__wrapper', {
                'video-fragment__wrapper--accumulator':
                    contract_type.toLowerCase() === CONTRACT_LIST.ACCUMULATORS.toLowerCase(),
            })}
        >
            {is_loading && <Loading is_fullscreen={false} />}
            <DotLottieReact
                src={lottie_src}
                loop
                autoplay
                dotLottieRefCallback={
                    dotLottieRefCallback as React.ComponentProps<typeof DotLottieReact>['dotLottieRefCallback']
                }
            />
        </div>
    );
};

export default VideoFragment;
