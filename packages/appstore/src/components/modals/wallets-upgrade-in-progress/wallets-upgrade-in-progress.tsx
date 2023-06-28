import React from 'react';
import { Text, Modal, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './wallets-upgrade-in-progress.scss';

const WalletsUpgradeInProgress = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_wallet_upgrade_in_progress, setWalletsUpgradeInProgressPopup } = traders_hub;
    const { is_mobile } = ui;

    const handleClose = () => {
        setWalletsUpgradeInProgressPopup(false);
    };
    return (
        <Modal
            is_open={is_wallet_upgrade_in_progress}
            toggleModal={handleClose}
            width={is_mobile ? '32.4rem' : '44.6rem'}
        >
            <div>
                <Modal.Body className='wallets-upgrade-in-progress'>
                    <Text
                        as='h1'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        weight='bold'
                        className='wallets-upgrade-in-progress__title'
                    >
                        {localize('Wallet upgrade in progress')}
                    </Text>
                    <Text size={is_mobile ? 'xxs' : 'xs'}>
                        {localize(
                            "This may take up to 2 minutes.  During this time, you won't be able to deposit, withdraw, transfer, and add new accounts."
                        )}
                    </Text>
                </Modal.Body>
                <Modal.Footer className='wallets-upgrade-in-progress__footer'>
                    <Button primary large onClick={handleClose} classNameSpan='wallets-upgrade-in-progress__text'>
                        {localize('Okay')}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
});

export default WalletsUpgradeInProgress;
