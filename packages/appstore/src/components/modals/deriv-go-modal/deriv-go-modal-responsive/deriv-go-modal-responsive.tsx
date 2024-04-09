import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { MobileDialog } from '@deriv/components';
import './deriv-go-modal-responsive.scss';

export const DerivGoModalResponsive = observer(() => {
    const { traders_hub } = useStore();
    const { is_deriv_go_modal_visible, setIsDerivGoModalVisible } = traders_hub;

    const handleModalClose = () => {
        setIsDerivGoModalVisible(false);
    };

    // width for image is 72%

    return (
        <MobileDialog
            portal_element_id='modal_root'
            visible={is_deriv_go_modal_visible}
            onClose={handleModalClose}
            wrapper_classname='mobile-real-wallets-upgrade'
            // footer={<MobileRealWalletsUpgradeFooter wallet_steps={wallet_steps} current_step={current_step} />}
            footer={<div>Footer</div>}
        >
            <div className='mobile-real-wallets-upgrade'>Deriv Go responsive</div>
        </MobileDialog>
    );
});
