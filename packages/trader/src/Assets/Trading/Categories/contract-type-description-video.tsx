import React from 'react';
import { useStore } from '@deriv/stores';
import { getDescriptionVideoId } from 'Modules/Trading/Helpers/contract-type';
import VideoStream from './video-stream';

type TContractTypeDescriptionVideo = {
    data_testid?: string;
    selected_contract_type?: string;
};

const ContractTypeDescriptionVideo = ({ data_testid, selected_contract_type }: TContractTypeDescriptionVideo) => {
    const { ui } = useStore();
    const { is_dark_mode_on: is_dark_theme, is_mobile } = ui;
    if (!selected_contract_type) {
        return null;
    }
    return (
        <div className='contract-type-info__video' data-testid={data_testid}>
            {/* In order to create a custom player later, please install @cloudflare/stream-react,
                and use the official Stream component instead of the temporary VideoStream.
                Official Stream component methods can be used via its streamRef prop, e.g.:
                    const ref = React.useRef<StreamPlayerApi>();
                    <Stream streamRef={ref} ... />
                    ref.current.play()
                More: https://www.npmjs.com/package/@cloudflare/stream-react
                API: https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/using-the-player-api/
                Please use getDescriptionDownloadUrl helper in order to add a Download feature. */}
            <VideoStream
                autoplay
                controls
                disable_picture_in_picture
                height={is_mobile ? '184.5px' : '270px'}
                letterbox_color='transparent' // unsets the default black background of the iframe
                loop
                preload='auto'
                src={getDescriptionVideoId(selected_contract_type, is_dark_theme)}
                width='100%'
            />
        </div>
    );
};

export default React.memo(ContractTypeDescriptionVideo);
