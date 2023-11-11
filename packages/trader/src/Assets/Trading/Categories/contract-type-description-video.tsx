import React from 'react';
import { useStore } from '@deriv/stores';
import { Stream, StreamPlayerApi } from '@cloudflare/stream-react';
import { getDescriptionVideoId } from 'Modules/Trading/Helpers/contract-type';

type TContractTypeDescriptionVideo = {
    selected_contract_type?: string;
    data_testid?: string;
};

const ContractTypeDescriptionVideo = ({ selected_contract_type, data_testid }: TContractTypeDescriptionVideo) => {
    const { ui } = useStore();
    const { is_dark_mode_on: is_dark_theme } = ui;
    // This ref will be used for creation of a custom player later, e.g. ref.current.play():
    // More: https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/using-the-player-api/
    // and at https://www.npmjs.com/package/@cloudflare/stream-react
    // Please use getDescriptionDownloadUrl helper for the download feature.
    const ref = React.useRef<StreamPlayerApi>();
    if (!selected_contract_type) {
        return null;
    }
    return (
        <div className='contract-type-info__video'>
            <Stream
                autoplay
                controls
                data-testid={data_testid}
                letterboxColor='transparent'
                loop
                preload='auto'
                responsive={false}
                src={getDescriptionVideoId(selected_contract_type, is_dark_theme)}
                streamRef={ref}
            />
        </div>
    );
};

export default React.memo(ContractTypeDescriptionVideo);
