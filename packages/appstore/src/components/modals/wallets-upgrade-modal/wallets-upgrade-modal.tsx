import React from 'react';
import { useWalletMigration } from '@deriv/hooks';
import { Button, Text, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import './wallets-upgrade-modal.scss';
import classNames from 'classnames';
import { getUrlBase } from '@deriv/shared';

const WalletsUpgradeModal = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade } = traders_hub;
    const { is_mobile, is_desktop } = ui;
    const { is_eligible, startMigration } = useWalletMigration();
    const isWalletMigrationModalClosed = localStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);
    const [iframeError, setIframeError] = React.useState(false);

    const iframeSrc =
        'https://customer-hhvo3ceuqt00w8g8.cloudflarestream.com/7ed5dfd27cdd290e088be8e91201a7f1/iframe?autoplay=true&preload=auto';
    const fallbackVideoSrc = getUrlBase('/public/video/wallets_introduction.mp4');

    const closeModal = () => {
        setModalOpen(false);
        localStorage.setItem('is_wallet_migration_modal_closed', 'true');
        toggleWalletsUpgrade(false);
    };

    const handleMigration = () => {
        closeModal();
        startMigration();
    };

    return (
        <Modal
            className='wallets-upgrade-modal'
            is_open={(is_eligible && modalOpen) || is_real_wallets_upgrade_on}
            width={is_mobile ? '32.8rem' : '116rem'}
            title=' '
            toggleModal={closeModal}
        >
            <Modal.Body>
                <div className='wallets-upgrade-modal__content'>
                    <div className='wallets-upgrade-modal__media-container'>
                        {!iframeError ? (
                            <iframe
                                className='wallets-upgrade-modal__video'
                                src={iframeSrc}
                                allow='accelerometer; gyroscope; autoplay; encrypted-media;'
                                allowFullScreen={true}
                                onError={() => setIframeError(true)}
                            />
                        ) : (
                            <video
                                className='wallets-upgrade-modal__video'
                                autoPlay={true}
                                controls
                                preload='auto'
                                playsInline
                                disablePictureInPicture
                                controlsList='nodownload'
                                src={fallbackVideoSrc}
                            />
                        )}
                    </div>
                    <div className='wallets-upgrade-modal__text'>
                        <Text align='center' size={is_mobile ? 's' : 'm'} weight='bold'>
                            <Localize i18n_default_text='Introducing Wallets' />
                        </Text>
                        <Text align='center' size={is_mobile ? 'xs' : 's'}>
                            <Localize
                                i18n_default_text='Use Wallets to manage your funds across different currencies effortlessly.'
                                components={[<br key={0} />]}
                            />
                        </Text>
                    </div>
                </div>
                <div
                    className={classNames({
                        'wallets-upgrade-modal__footer--desktop': !is_mobile,
                        'wallets-upgrade-modal__footer--mobile': is_mobile,
                    })}
                >
                    <Button large={is_desktop} onClick={handleMigration} primary text={localize('Enable now')} />
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default WalletsUpgradeModal;
