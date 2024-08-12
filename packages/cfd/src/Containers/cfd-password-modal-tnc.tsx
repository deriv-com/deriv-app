import React from 'react';
import { getCFDPlatformLabel, CFD_PRODUCTS_TITLE, CFD_PLATFORMS } from '@deriv/shared';
import { observer } from '@deriv/stores';
import CfdPasswordModalInfo from './cfd-password-modal-info';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import classNames from 'classnames';

type CfdPasswordModalTncProps = {
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    checked: boolean;
    onCheck: () => void;
    className?: string;
};

const CfdPasswordModalTnc = observer(({ platform, className }: CfdPasswordModalTncProps) => {
    const { jurisdiction_selected_shortcode } = useCfdStore();

    return (
        <div className={classNames('cfd-password-modal-tnc', className)}>
            <CfdPasswordModalInfo
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                platform={getCFDPlatformLabel(platform)}
                product={CFD_PRODUCTS_TITLE.ZEROSPREAD}
            />
        </div>
    );
});

export default CfdPasswordModalTnc;
