import React from 'react';
import { VideoPlayer } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { getDescriptionVideoId } from 'Modules/Trading/Helpers/video-config';
import VideoPreview from 'AppV2/Components/Guide/Description/video-preview';
import './contract-type-description-video.scss';

type TContractTypeDescriptionVideo = {
    data_testid?: string;
    selected_contract_type?: string;
};

const ContractTypeDescriptionVideo = ({ data_testid, selected_contract_type }: TContractTypeDescriptionVideo) => {
    const { ui } = useStore();
    const { is_dark_mode_on: is_dark_theme, is_mobile } = ui;
    const [is_video_player_opened, setIsVideoPlayerOpened] = React.useState(false);

    if (!selected_contract_type) {
        return null;
    }

    const video_src = getDescriptionVideoId(selected_contract_type, is_dark_theme);

    const toggleVideoPlayer = () => {
        setIsVideoPlayerOpened(!is_video_player_opened);
    };

    return (
        <div className='contract-type-info__video'>
            {is_video_player_opened ? (
                <VideoPlayer
                    src={video_src}
                    is_mobile={is_mobile}
                    data_testid={data_testid}
                    should_show_controls={true}
                    muted={true}
                    hide_volume_control={true}
                />
            ) : (
                <VideoPreview
                    only_show_thumbnail
                    contract_type={selected_contract_type}
                    toggleVideoPlayer={toggleVideoPlayer}
                    video_src={video_src}
                    custom_width='518px'
                    custom_height='270px'
                />
            )}
        </div>
    );
};

export default React.memo(ContractTypeDescriptionVideo);
