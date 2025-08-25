import React from 'react';
import { Stream } from '@cloudflare/stream-react';
import { CaptionText } from '@deriv-com/quill-ui';
import { LabelPairedPlayMdFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

type TVideoPreview = {
    contract_type: string;
    toggleVideoPlayer: () => void;
    video_src: string;
    only_show_thumbnail?: boolean;
    custom_width?: string;
    custom_height?: string;
};

const VideoPreview = ({
    contract_type,
    toggleVideoPlayer,
    video_src,
    only_show_thumbnail = false,
    custom_width,
    custom_height,
}: TVideoPreview) => (
    <div className='guide-video__wrapper' onClick={toggleVideoPlayer} onKeyDown={toggleVideoPlayer}>
        <div className='guide-video__preview' data-testid='dt_video_preview'>
            <Stream
                className='guide-video'
                letterboxColor='transparent'
                muted
                preload='auto'
                responsive={false}
                src={video_src}
                width={custom_width || '112px'}
                height={custom_height || '73px'}
            />
            <div className='guide-video__preview__icon__wrapper'>
                <LabelPairedPlayMdFillIcon className='guide-video__preview__icon' />
            </div>
        </div>
        {!only_show_thumbnail && (
            <div className='guide-video__description'>
                <CaptionText bold color='quill-typography__color--default'>
                    <Localize i18n_default_text='How to trade ' />
                    {contract_type}?
                </CaptionText>
                <CaptionText color='quill-typography__color--default'>
                    <Localize i18n_default_text='Watch this video to learn about this trade type.' />
                </CaptionText>
            </div>
        )}
    </div>
);

export default VideoPreview;
