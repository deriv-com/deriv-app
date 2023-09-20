import React from 'react';
import { Modal } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import WalletsUpgradeFooter from './wallets-upgrade-footer';
import WalletsUpgradeContent from './wallets-upgrade-content';
import { TRealWalletsUpgradeSteps } from 'Types';

const DesktopRealWalletsUpgrade = observer(({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const { traders_hub: is_real_wallets_upgrade_on } = useStore();

    const { handleClose } = wallet_upgrade_steps;

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
                <WalletsUpgradeContent wallet_upgrade_steps={wallet_upgrade_steps} />
            </Modal.Body>
            <WalletsUpgradeFooter wallet_upgrade_steps={wallet_upgrade_steps} />
        </Modal>
    );
});

export default DesktopRealWalletsUpgrade;
