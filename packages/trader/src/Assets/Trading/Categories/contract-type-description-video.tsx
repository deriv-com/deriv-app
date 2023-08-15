import React from 'react';
import { localize } from '@deriv/translations';
import { getUrlBase, isMobile } from '@deriv/shared';
import { useStore } from '@deriv/stores';

type TContractTypeDescriptionVideo = {
    selected_contract_type?: string;
    data_testid?: string;
};

const ContractTypeDescriptionVideo = ({ selected_contract_type, data_testid }: TContractTypeDescriptionVideo) => {
    const { ui } = useStore();
    const { is_dark_mode_on: is_dark_theme } = ui;
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
    return (
        <video
            autoPlay
            loop
            playsInline
            disablePictureInPicture
            controlsList='nodownload'
            onContextMenu={e => e.preventDefault()}
            preload='auto'
            controls
            width={isMobile() ? 328 : 480}
            height={isMobile() ? 184.5 : 270}
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
