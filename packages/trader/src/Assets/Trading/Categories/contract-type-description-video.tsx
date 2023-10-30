import React from 'react';
import { localize } from '@deriv/translations';
import { getUrlBase } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Stream, StreamPlayerApi } from '@cloudflare/stream-react';

type TContractTypeDescriptionVideo = {
    selected_contract_type?: string;
    data_testid?: string;
};

const ContractTypeDescriptionVideo = ({ selected_contract_type, data_testid }: TContractTypeDescriptionVideo) => {
    const { ui } = useStore();
    const { is_dark_mode_on: is_dark_theme, is_mobile } = ui;
    // This ref will be used for creation of a custom player later, e.g. ref.current.play():
    // More: https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/using-the-player-api/
    const ref = React.useRef<StreamPlayerApi>();
    const accumulator_video_uid = 'c4b95d108a456bd2ec177499abbeec6d';
    const getVideoSource = React.useCallback(
        (extension: 'mp4' | 'webm') => {
            return getUrlBase(
                `/public/videos/${selected_contract_type}_description${is_dark_theme ? '_dark' : '_light'}.${extension}`
            );
        },
        [is_dark_theme, selected_contract_type]
    );

    // memoize file paths for videos and open the modal only after we get them
    const mp4_src = React.useMemo(() => getVideoSource('mp4'), [getVideoSource]);
    const webm_src = React.useMemo(() => getVideoSource('webm'), [getVideoSource]);
    if (!selected_contract_type) {
        return null;
    }
    return selected_contract_type === 'accumulator' && !is_mobile && !is_dark_theme ? (
        // Test for Accumulators video for light theme in desktop.
        // More: https://www.npmjs.com/package/@cloudflare/stream-react
        <Stream
            autoplay
            controls
            data-testid={data_testid}
            letterboxColor='transparent'
            loop
            preload='auto'
            src={accumulator_video_uid}
            streamRef={ref}
            className='contract-type-info__video-stream'
        />
    ) : (
        <video
            autoPlay
            loop
            playsInline
            disablePictureInPicture
            controlsList='nodownload'
            onContextMenu={e => e.preventDefault()}
            preload='auto'
            controls
            width={is_mobile ? 328 : 480}
            height={is_mobile ? 184.5 : 270}
            className='contract-type-info__video'
            data-testid={data_testid}
        >
            {/* a browser will select a source with extension it recognizes */}
            <source src={mp4_src} type='video/mp4' />
            <source src={webm_src} type='video/webm' />
            {localize('Unfortunately, your browser does not support the video.')}
        </video>
    );
};

export default React.memo(ContractTypeDescriptionVideo);
