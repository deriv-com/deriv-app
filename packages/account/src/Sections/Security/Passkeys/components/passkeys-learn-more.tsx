import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

import { Icon } from '@deriv/components';
import { getUrlBase } from '@deriv/shared';
import { Skeleton } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';

import { TPasskeysButtonOnClicks } from './passkeys-status-layout';

const ASPECT_RATIO = 0.5625;

export const PasskeysLearnMore = ({ onSecondaryButtonClick }: TPasskeysButtonOnClicks) => {
    const [is_loading, setIsLoading] = useState(true);

    // memoize file paths for videos and open the modal only after we get them
    const getVideoSource = useCallback(
        (extension: string) => getUrlBase(`/public/videos/biometric_mobile.${extension}`),
        []
    );
    const mp4_src = useMemo(() => getVideoSource('mp4'), [getVideoSource]);

    return (
        <div className='passkeys'>
            <Icon
                data_testid='dt_learn_more_back_button'
                icon='IcBackButton'
                onClick={onSecondaryButtonClick}
                className='passkeys-status__description-back-button'
            />
            <div
                className={clsx(
                    'passkeys-status__video__wrapper',
                    is_loading && 'passkeys-status__video__wrapper--is-loading'
                )}
            >
                {is_loading && <Skeleton.Square height={`calc(100vw * ${ASPECT_RATIO})`} />}
                <video
                    autoPlay
                    className='passkeys-status__video'
                    controls
                    data-testid='dt_onboarding_guide_video'
                    onLoadedData={() => setIsLoading(false)}
                    preload='auto'
                >
                    {/* a browser will select a source with extension it recognizes */}
                    <source src={mp4_src} type='video/mp4' />
                    <Localize i18n_default_text='Unfortunately, your browser does not support the video.' />
                </video>
            </div>
        </div>
    );
};
