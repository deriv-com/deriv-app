import React from 'react';
import { getCFDPlatformLabel, CFD_PRODUCTS_TITLE, CFD_PLATFORMS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import CfdPasswordModalInfo from './cfd-password-modal-info';
import JurisdictionCheckBox from './jurisdiction-modal/jurisdiction-modal-checkbox';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import classNames from 'classnames';

type CfdPasswordModalTncProps = {
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    checked: boolean;
    onCheck: () => void;
    className?: string;
};

const CfdPasswordModalTnc = observer(({ platform, checked, onCheck, className }: CfdPasswordModalTncProps) => {
    const { client } = useStore();
    const { should_restrict_vanuatu_account_creation, should_restrict_bvi_account_creation } = client;
    const { jurisdiction_selected_shortcode } = useCfdStore();

    return (
        <div className={classNames('cfd-password-modal-tnc', className)}>
            <CfdPasswordModalInfo
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                platform={getCFDPlatformLabel(platform)}
                product={CFD_PRODUCTS_TITLE.ZEROSPREAD}
            />
            <JurisdictionCheckBox
                is_checked={checked}
                onCheck={onCheck}
                class_name='cfd-password-modal__checkbox'
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                should_restrict_bvi_account_creation={should_restrict_bvi_account_creation}
                should_restrict_vanuatu_account_creation={should_restrict_vanuatu_account_creation}
            />
        </div>
    );
});

export default CfdPasswordModalTnc;
