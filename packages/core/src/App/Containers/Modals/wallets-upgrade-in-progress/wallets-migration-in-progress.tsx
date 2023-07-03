import React from 'react';
import { Text, Modal, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './wallets-migration-in-progress.scss';

const WalletsMigrationInProgress = observer(() => {
    const { ui, client } = useStore();
    const { is_wallet_migration_in_progress, setWalletsMigrationInProgressPopup } = client;
    const { is_mobile } = ui;

    const handleClose = () => {
        setWalletsMigrationInProgressPopup(false);
    };

    return (
        <Modal
            is_open={is_wallet_migration_in_progress}
            toggleModal={handleClose}
            width={is_mobile ? '32.4rem' : '44.6rem'}
        >
            <div>
                <Modal.Body className='wallets-migration-in-progress'>
                    <Text
                        as='h1'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        weight='bold'
                        className='wallets-migration-in-progress__title'
                    >
                        {localize('Wallet upgrade in progress')}
                    </Text>
                    <Text size={is_mobile ? 'xxs' : 'xs'}>
                        {localize(
                            "This may take up to 2 minutes.  During this time, you won't be able to deposit, withdraw, transfer, and add new accounts."
                        )}
                    </Text>
                </Modal.Body>
                <Modal.Footer className='wallets-migration-in-progress__footer'>
                    <Button primary large onClick={handleClose} classNameSpan='wallets-migration-in-progress__text'>
                        {localize('Okay')}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
});

export default WalletsMigrationInProgress;
