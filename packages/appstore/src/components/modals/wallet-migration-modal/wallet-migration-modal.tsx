import React from 'react';

import { Button, Carousel, Icon, MobileDialog, Modal, Text, VideoPlayer } from '@deriv/components';
import { useGrowthbookGetFeatureValue, useWalletMigration } from '@deriv/hooks';
import { getDomainUrl } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

import { WalletMigrationContent } from './wallet-migration-content';

import './wallet-migration-modal.scss';

const WalletMigrationModal = observer(({ is_eu = false }: { is_eu?: boolean }) => {
    const { traders_hub, client } = useStore();
    const { setPreventRedirectToHub } = client;
    const { is_real_wallets_upgrade_on } = traders_hub;
    const [current_slide, setCurrentSlide] = React.useState(0);
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
        <div key={index} className='wallets-migration-modal__slide'>
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

    const handleButtonClick = () => {
        if (current_slide < slides.length - 1) {
            const next_slide = current_slide + 1;
            setCurrentSlide(next_slide);
        } else {
            onConfirmHandler();
        }
    };

    const onConfirmHandler = () => {
        startMigration();
        setPreventRedirectToHub(false);
        window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=home`;
        setModalOpen(false);
    };
    const handleSlideChange = (index: number) => {
        setCurrentSlide(index);
    };

    const current_content = slides[current_slide];
    const is_last_slide = current_slide === slides.length - 1;
    const is_first_slide = current_slide === 0;

    const ModalButton = () => (
        <Button
            large
            secondary={!is_last_slide}
            primary={is_last_slide}
            wide={!isDesktop}
            text={is_last_slide ? 'Get Started' : current_content.buttonLabel}
            onClick={handleButtonClick}
        />
    );

    const CarouselContent = ({ width }: { width?: React.ComponentProps<typeof Carousel>['width'] }) => (
        <Carousel
            className={
                isDesktop && is_first_slide
                    ? 'wallets-migration-modal__carousel--first-slide'
                    : 'wallets-migration-modal__carousel'
            }
            key={current_slide}
            list={CarouselSlide}
            initial_index={current_slide}
            onItemSelect={handleSlideChange}
            show_bullet={true}
            show_nav={false}
            disable_swipe={!isDesktop}
            bullet_position='bottom'
            active_bullet_color='var(--button-primary-default)'
            width={width}
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
            >
                <CarouselContent width={325} />
            </MobileDialog>
        );

    return (
        <Modal
            className='wallets-migration-modal'
            is_open={is_modal_open}
            title=' '
            has_close_icon={false}
            width={is_first_slide ? '44rem' : '74.2rem'}
        >
            <CarouselContent width={is_first_slide ? 376 : 678} />
            <Modal.Footer>
                <ModalButton />
            </Modal.Footer>
        </Modal>
    );
});

export default WalletMigrationModal;
