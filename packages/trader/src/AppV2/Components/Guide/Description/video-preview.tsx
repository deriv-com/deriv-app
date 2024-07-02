import React from 'react';
import { Stream } from '@cloudflare/stream-react';
import { CaptionText } from '@deriv-com/quill-ui';
import { LabelPairedPlayMdFillIcon } from '@deriv/quill-icons';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { clickAndKeyEventHandler } from '@deriv/shared';
import { CONTRACT_LIST, getDescriptionVideoId } from 'AppV2/Utils/trade-types-utils';
import VideoPlayer from 'App/Components/Elements/VideoPlayer';

type TVideoPreview = {
    contract_type: string;
};

const VideoPreview = observer(({ contract_type }: TVideoPreview) => {
    const [is_video_player_opened, setIsVideoPlayerOpened] = React.useState(false);
    const modal_ref = React.useRef<HTMLDialogElement>(null);

    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    const video_src = getDescriptionVideoId(contract_type, is_dark_mode_on);

    const toggleVideoPlayer = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(() => setIsVideoPlayerOpened(!is_video_player_opened), e);
    };

    React.useEffect(() => {
        if (modal_ref.current) is_video_player_opened ? modal_ref.current.showModal() : modal_ref.current.close();
    }, [is_video_player_opened]);

    // TODO: temporary we have no video for Turbos, so returning null until it will be ready
    if (contract_type === CONTRACT_LIST.TURBOS) return null;

    return (
        <div className='guide-video__wrapper'>
            <div className='guide-video__preview' onClick={toggleVideoPlayer} onKeyDown={toggleVideoPlayer}>
                <Stream
                    autoplay={false}
                    controls={false}
                    className='guide-video'
                    letterboxColor='transparent'
                    muted
                    preload='auto'
                    responsive={false}
                    src={video_src}
                    width='112px'
                    height='73px'
                />
                <div className='guide-video__preview__icon__wrapper'>
                    <LabelPairedPlayMdFillIcon className='guide-video__preview__icon' />
                </div>
            </div>
            <div className='guide-video__description'>
                <CaptionText bold color='quill-typography__color--default'>
                    {localize(`How to trade ${contract_type}?`)}
                </CaptionText>
                <CaptionText>
                    <Localize i18n_default_text='Watch this video to learn about this trade type.' />
                </CaptionText>
            </div>
            {is_video_player_opened && (
                <dialog
                    ref={modal_ref}
                    onClick={toggleVideoPlayer}
                    onKeyDown={toggleVideoPlayer}
                    className='modal-player'
                >
                    <div onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
                        <VideoPlayer
                            className='modal-player__wrapper'
                            data_testid='dt_video_player'
                            height='206px'
                            is_mobile
                            src={video_src}
                        />
                    </div>
                </dialog>
            )}
        </div>
    );
});

export default VideoPreview;
