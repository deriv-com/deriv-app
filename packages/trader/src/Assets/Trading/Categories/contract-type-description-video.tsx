import React from 'react';
import { useStore } from '@deriv/stores';
import VideoStream from 'App/Components/Elements/VideoStream';

type TContractTypeDescriptionVideo = {
    data_testid?: string;
    selected_contract_type?: string;
    videos?: object[];
};

const ContractTypeDescriptionVideo = ({
    data_testid,
    selected_contract_type,
    videos,
}: TContractTypeDescriptionVideo) => {
    const { ui } = useStore();
    const { is_dark_mode_on, is_mobile } = ui;
    const video = videos?.find(
        (video: any) =>
            video.meta.name ===
            `dtrader_${selected_contract_type}_description_${is_dark_mode_on ? 'dark' : 'light'}.mp4`
    );
    const video_id = (video as any)?.uid;
    if (!selected_contract_type) {
        return null;
    }
    return (
        <div className='contract-type-info__video'>
            {/* In order to create a custom player later, please install @cloudflare/stream-react,
                use the official Stream component, and remove the temporary VideoStream.
                Official Stream component methods can be used via its streamRef prop, e.g.:
                    const ref = React.useRef<StreamPlayerApi>();
                    // Call ref.current.play() or other methods when needed
                    <Stream
                        autoplay
                        controls
                        height={is_mobile ? '184.5px' : '270px'} // applied to iframe
                        letterboxColor='transparent' // unsets the default black background of the iframe
                        loop
                        preload='auto'
                        responsive={false} // unsets default styles of the iframe
                        src={getDescriptionVideoId(selected_contract_type, is_dark_theme)}
                        streamRef={ref}
                        width='100%' // applied to iframe
                    />                    
                More: https://www.npmjs.com/package/@cloudflare/stream-react
                API: https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/using-the-player-api/
                Please use getVideoDownloadUrl helper in order to add a Download feature. */}
            {!!video_id && (
                <VideoStream
                    autoplay
                    controls
                    disable_picture_in_picture
                    height={is_mobile ? 184.5 : 270}
                    loop
                    src={video_id}
                    test_id={data_testid}
                />
            )}
        </div>
    );
};

export default React.memo(ContractTypeDescriptionVideo);
