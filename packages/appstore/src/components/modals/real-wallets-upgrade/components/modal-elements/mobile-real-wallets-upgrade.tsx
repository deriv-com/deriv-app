import React from 'react';
import { MobileDialog, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TRealWalletsUpgrade } from 'Types';
import WalletsUpgradeContent from './wallets-upgrade-content';
import WalletsUpgradeFooter from './wallets-upgrade-footer';

const MobileRealWalletsUpgrade = observer(
    ({
        current_step,
        handleBack,
        handleClose,
        handleNext,
        is_disabled,
        toggleCheckbox,
        upgradeToWallets,
    }: TRealWalletsUpgrade) => {
        const { traders_hub: is_real_wallets_upgrade_on } = useStore();
        return (
            <MobileDialog
                portal_element_id='modal_root'
                visible={is_real_wallets_upgrade_on}
                onClose={handleClose}
                wrapper_classname='wallet-steps'
                footer={
                    <WalletsUpgradeFooter
                        handleClose={handleClose}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        toggleCheckbox={toggleCheckbox}
                        upgradeToWallets={upgradeToWallets}
                        is_disabled={is_disabled}
                        current_step={current_step}
                    />
                }
            >
                <Modal.Body className='wallet-steps'>
                    <WalletsUpgradeContent
                        handleClose={handleClose}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        toggleCheckbox={toggleCheckbox}
                        upgradeToWallets={upgradeToWallets}
                        is_disabled={is_disabled}
                        current_step={current_step}
                    />
                </Modal.Body>
            </MobileDialog>
        );
    }
);

export default MobileRealWalletsUpgrade;
