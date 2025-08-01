import React from 'react';
import classNames from 'classnames';

import { Button, Carousel, Icon, MobileDialog, Modal, Text, VideoPlayer } from '@deriv/components';
import { useGrowthbookGetFeatureValue, useWalletMigration } from '@deriv/hooks';
import { getDomainUrl } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

import { WalletMigrationContent } from './wallet-migration-content';

import './wallet-migration-modal.scss';

const WalletMigrationModal = observer(({ is_eu = false }: { is_eu?: boolean }) => {
    const { traders_hub, client } = useStore();
    const { setPreventRedirectToHub } = client;
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade } = traders_hub;
    const { is_eligible, is_migrating, is_in_progress, startMigration } = useWalletMigration();
    const { isDesktop } = useDevice();
    const [is_wallet_force_migration_enabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'wallet_force_migration',
        defaultValue: false,
    });
    const isWalletMigrationModalClosed = localStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);
    const is_modal_open_for_force_migration = is_wallet_force_migration_enabled && !(is_in_progress || is_migrating);
    const is_modal_open_for_non_force_migration = (is_eligible && modalOpen) || is_real_wallets_upgrade_on;
    const is_modal_open = is_modal_open_for_force_migration || is_modal_open_for_non_force_migration;

    const PRODUCTION_REDIRECT_URL = `https://hub.${getDomainUrl()}/tradershub`;
    const STAGING_REDIRECT_URL = `https://staging-hub.${getDomainUrl()}/tradershub`;
    const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;

    const slides = WalletMigrationContent({ is_eu, is_mobile: !isDesktop });

    const CarouselSlide = slides.map((content, index) => (
        <div
            key={index}
            className={classNames('wallets-migration-modal__slide', {
                'wallets-migration-modal__slide--narrow': index === 0 && isDesktop,
            })}
        >
            <div className='wallets-migration-modal__video-container'>
                {content.src ? (
                    <VideoPlayer src={content.src} height='326px' muted show_loading hide_volume_control />
                ) : (
                    <Icon icon='IcAppstoreWalletMigration' width={158} height={200} />
                )}
            </div>
            <div className='wallets-migration-modal__text-container'>
                <Text size='m' weight='bold'>
                    {content.title}
                </Text>
                <Text size='s'>{content.description}</Text>
            </div>
        </div>
    ));

    const onConfirmHandler = () => {
        startMigration();
        setPreventRedirectToHub(false);
        window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=home`;
        setModalOpen(false);
    };

    const closeModal = () => {
        setModalOpen(false);
        localStorage.setItem('is_wallet_migration_modal_closed', 'true');
        toggleWalletsUpgrade(false);
    };

    const ModalButton = () => (
        <Button large primary wide={!isDesktop} text={localize('Get Started')} onClick={() => onConfirmHandler()} />
    );

    const CarouselContent = ({ width }: { width?: React.ComponentProps<typeof Carousel>['width'] }) => (
        <Carousel
            className='wallets-migration-modal__carousel'
            list={CarouselSlide}
            show_bullet={true}
            show_nav={false}
            disable_swipe={!isDesktop}
            bullet_position='bottom'
            active_bullet_color='var(--button-primary-default)'
            width={width}
            autoplay_time={5000}
        />
    );

    if (!isDesktop)
        return (
            <MobileDialog
                portal_element_id='deriv_app'
                wrapper_classname='wallets-migration-modal__modal'
                visible={is_modal_open}
                has_full_height
                footer={
                    <div className='wallets-migration-modal__footer-mobile'>
                        <ModalButton />
                    </div>
                }
                onClose={() => closeModal()}
                title={<Localize i18n_default_text='The all-new Trader’s Hub' />}
            >
                <CarouselContent width={325} />
            </MobileDialog>
        );

    return (
        <Modal
            className='wallets-migration-modal'
            is_open={is_modal_open}
            title={localize('The all-new Trader’s Hub')}
            width='78.8rem'
            toggleModal={() => closeModal()}
        >
            <CarouselContent width={678} />
            <Modal.Footer>
                <ModalButton />
            </Modal.Footer>
        </Modal>
    );
});

export default WalletMigrationModal;
