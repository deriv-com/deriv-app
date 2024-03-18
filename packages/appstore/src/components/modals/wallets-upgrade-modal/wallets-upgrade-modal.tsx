import React from 'react';
import { useWalletMigration } from '@deriv/api';
import { Text, Button, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import WalletsImage from 'Assets/svgs/wallets';
import './wallets-upgrade-modal.scss';

const WalletsUpgradeModal = observer(() => {
    const { traders_hub, ui } = useStore();
    const { toggleWalletsUpgrade } = traders_hub;
    const { is_mobile, is_desktop } = ui;
    const { is_eligible } = useWalletMigration();
    const isWalletMigrationModalClosed = localStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);

    const closeModal = () => {
        setModalOpen(false);
        localStorage.setItem('is_wallet_migration_modal_closed', 'true');
    };

    return (
        <Modal
            className='wallets-upgrade-modal'
            is_open={is_eligible && modalOpen}
            width='60rem'
            title=' '
            toggleModal={closeModal}
        >
            <Modal.Body>
                <div className='wallets-upgrade-modal__content'>
                    <WalletsImage
                        image={`enable_wallets_modal_${is_mobile ? 'mobile' : 'desktop'}`}
                        className='wallets-upgrade-modal__image'
                    />
                    <div className='wallets-upgrade-modal__description'>
                        <Text align={is_mobile ? 'center' : 'left'} size={is_mobile ? 's' : 'm'} weight='bold'>
                            <Localize i18n_default_text='Introducing Wallets' />
                        </Text>
                        <Text align={is_mobile ? 'center' : 'left'} size={is_mobile ? 'xs' : 's'}>
                            <Localize
                                i18n_default_text='Enjoy seamless transactions across multiple currencies and an intuitive user interface with funds segregation.'
                                components={[<br key={0} />]}
                            />
                        </Text>
                    </div>
                    <Button
                        large={is_desktop}
                        onClick={() => {
                            toggleWalletsUpgrade(true);
                            closeModal();
                        }}
                        primary
                        text={localize('Enable now')}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default WalletsUpgradeModal;
