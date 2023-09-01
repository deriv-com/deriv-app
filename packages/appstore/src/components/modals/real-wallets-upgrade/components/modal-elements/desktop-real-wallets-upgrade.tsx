import React from 'react';
import { Modal } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import WalletsUpgradeFooter from './wallets-upgrade-footer';
import WalletsUpgradeContent from './wallets-upgrade-content';
import { TRealWalletsUpgrade } from 'Types';

const DesktopRealWalletsUpgrade = observer(
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
            <Modal
                is_open={is_real_wallets_upgrade_on}
                toggleModal={handleClose}
                height='734px'
                width='1200px'
                should_header_stick_body={false}
                has_close_icon
                title=' '
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
                <WalletsUpgradeFooter
                    handleClose={handleClose}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    toggleCheckbox={toggleCheckbox}
                    upgradeToWallets={upgradeToWallets}
                    is_disabled={is_disabled}
                    current_step={current_step}
                />
            </Modal>
        );
    }
);

export default DesktopRealWalletsUpgrade;
