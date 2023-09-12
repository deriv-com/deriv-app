import React from 'react';
import { MobileDialog, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TRealWalletsUpgradeSteps } from 'Types';
import WalletsUpgradeContent from './wallets-upgrade-content';
import WalletsUpgradeFooter from './wallets-upgrade-footer';

const MobileRealWalletsUpgrade = observer(({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const { traders_hub: is_real_wallets_upgrade_on } = useStore();

    return (
        <MobileDialog
            portal_element_id='modal_root'
            visible={is_real_wallets_upgrade_on}
            onClose={wallet_upgrade_steps.handleClose}
            wrapper_classname='wallet-steps'
            footer={<WalletsUpgradeFooter wallet_upgrade_steps={wallet_upgrade_steps} />}
        >
            <Modal.Body className='wallet-steps'>
                <WalletsUpgradeContent wallet_upgrade_steps={wallet_upgrade_steps} />
            </Modal.Body>
        </MobileDialog>
    );
});

export default MobileRealWalletsUpgrade;
