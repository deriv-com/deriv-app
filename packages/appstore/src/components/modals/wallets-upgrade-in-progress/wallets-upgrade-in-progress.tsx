import React from 'react';
import { Text, useOnClickOutside, Modal, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './wallets-upgrade-in-progress.scss';

const WalletsUpgradeInProgress = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_wallet_upgrade_in_progress, setWalletsUpgradeInProgressPopup } = traders_hub;
    const { is_mobile } = ui;

    const mobile_add_class = is_mobile ? '--mobile' : '';

    const wallets_upgrade_in_progress_ref = React.useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setWalletsUpgradeInProgressPopup(false);
    };

    const validateClickOutside = (e: MouseEvent) => {
        return is_wallet_upgrade_in_progress && !wallets_upgrade_in_progress_ref?.current?.contains(e.target as Node);
    };

    useOnClickOutside(wallets_upgrade_in_progress_ref, handleClose, validateClickOutside);

    return (
        <Modal
            is_open={is_wallet_upgrade_in_progress}
            toggleModal={handleClose}
            width={is_mobile ? '32.3rem' : '44rem'}
            should_header_stick_body={false}
            has_close_icon={false}
        >
            <div ref={wallets_upgrade_in_progress_ref}>
                <Modal.Body className={`wallets-upgrade-in-progress${mobile_add_class}`}>
                    <Text
                        as='h1'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        weight='bold'
                        className={`wallets-upgrade-in-progress__title${mobile_add_class}`}
                    >
                        {localize('Wallet upgrade in progress')}
                    </Text>
                    <Text size={is_mobile ? 'xxs' : 'xs'}>
                        {localize(
                            "This may take up to 2 minutes.  During this time, you won't be able to deposit, withdraw, transfer, and add new accounts."
                        )}
                    </Text>
                </Modal.Body>
                <Modal.Footer className={`wallets-upgrade-in-progress__footer${mobile_add_class}`}>
                    <Button
                        primary
                        large
                        onClick={handleClose}
                        classNameSpan={`wallets-upgrade-in-progress__text${mobile_add_class}`}
                    >
                        {localize('Okay')}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
});

export default WalletsUpgradeInProgress;
