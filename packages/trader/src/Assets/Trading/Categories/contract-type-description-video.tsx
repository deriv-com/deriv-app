import React from 'react';
import { VideoPlayer } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { getDescriptionVideoId } from 'Modules/Trading/Helpers/video-config';

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
        <div className='contract-type-info__video'>
            <VideoPlayer
                src={getDescriptionVideoId(selected_contract_type, is_dark_theme)}
                is_mobile={is_mobile}
                data_testid={data_testid}
            />
        </div>
    );
};

export default React.memo(ContractTypeDescriptionVideo);
