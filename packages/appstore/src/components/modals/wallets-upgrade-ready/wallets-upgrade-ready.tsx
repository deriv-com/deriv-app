import React from 'react';
import { Text, useOnClickOutside, Modal, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './wallets-upgrade-ready.scss';

const WalletsUpgradeReady = observer(() => {
    const { traders_hub, ui, client } = useStore();
    const { is_wallet_upgrade_ready, setWalletsUpgradeReadyPopup } = traders_hub;
    const { is_mobile } = ui;
    const { logout } = client;

    const mobile_add_class = is_mobile ? '--mobile' : '';

    const wallets_upgrade_ready_ref = React.useRef<HTMLDivElement>(null);

    const handleClose = async () => {
        setWalletsUpgradeReadyPopup(false);
    };

    const handleLogoutButtonClick = async () => {
        setWalletsUpgradeReadyPopup(false);
        await logout();
    };

    const validateClickOutside = (e: MouseEvent) => {
        return is_wallet_upgrade_ready && !wallets_upgrade_ready_ref?.current?.contains(e.target as Node);
    };

    useOnClickOutside(wallets_upgrade_ready_ref, handleClose, validateClickOutside);

    return (
        <Modal
            is_open={is_wallet_upgrade_ready}
            toggleModal={handleClose}
            width={is_mobile ? '32.3rem' : '44rem'}
            should_header_stick_body={false}
            has_close_icon={false}
        >
            <div ref={wallets_upgrade_ready_ref}>
                <Modal.Body className={`wallets-upgrade-ready${mobile_add_class}`}>
                    <Text
                        as='h1'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        weight='bold'
                        className={`wallets-upgrade-ready__title${mobile_add_class}`}
                    >
                        {localize('Your Wallets are ready')}
                    </Text>
                    <Text size={is_mobile ? 'xxs' : 'xs'}>
                        {localize(
                            'To complete the upgrade, please log out and log in again to add more accounts and make transactions with your Wallets.'
                        )}
                    </Text>
                </Modal.Body>
                <Modal.Footer className={`wallets-upgrade-ready__footer${mobile_add_class}`}>
                    <Button
                        primary
                        large
                        onClick={handleLogoutButtonClick}
                        classNameSpan={`wallets-upgrade-ready__text${mobile_add_class}`}
                    >
                        {localize('Log out')}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
});

export default WalletsUpgradeReady;
