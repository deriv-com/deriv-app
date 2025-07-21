import React from 'react';

import { Button, Carousel, Icon, Modal, Text, VideoPlayer } from '@deriv/components';
import { useWalletMigration } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

import { WalletMigrationContent } from './wallet-migration-content';

import './wallet-migration-modal.scss';

const WalletMigrationModal = observer(({ is_eu = false }) => {
    const { ui } = useStore();
    const [current_slide, setCurrentSlide] = React.useState(0);
    const { is_desktop, is_mobile } = ui;
    const { startMigration } = useWalletMigration();

    const slides = WalletMigrationContent({ is_eu });

    // Create the carousel slides
    const CarouselSlide = slides.map((content, index) => (
        <div key={index} className='wallets-migration-modal__slide'>
            <div className='wallets-migration-modal__video-container'>
                {content.src ? (
                    <VideoPlayer
                        src={content.src}
                        height={is_desktop ? '311px' : '157px'}
                        is_mobile={is_mobile}
                        muted
                    />
                ) : (
                    <Icon icon='IcAppstoreWalletMigration' width={158} height={200} />
                )}
            </div>
            <div className='wallets-migration-modal__text-container'>
                <Text size={is_desktop ? 'm' : 's'} weight='bold'>
                    {content.title}
                </Text>
                <Text size={is_desktop ? 's' : 'xs'}>{content.description}</Text>
            </div>
        </div>
    ));

    const handleButtonClick = () => {
        if (current_slide < slides.length - 1) {
            // Navigate to next slide
            const next_slide = current_slide + 1;
            setCurrentSlide(next_slide);
        } else {
            // Last slide - handle completion (close modal, etc.)
            handleMigrationComplete();
        }
    };

    const handleMigrationComplete = () => {
        startMigration();
    };

    const handleSlideChange = (index: number) => {
        setCurrentSlide(index);
    };

    const current_content = slides[current_slide];
    const is_last_slide = current_slide === slides.length - 1;

    return (
        <Modal className='wallets-migration-modal' is_open={true} title=' ' has_close_icon={false} width='51.2rem'>
            <Carousel
                className='wallets-migration-modal__carousel'
                key={current_slide}
                list={CarouselSlide}
                initial_index={current_slide}
                onItemSelect={handleSlideChange}
                show_bullet={true}
                show_nav={false}
                disable_swipe={is_mobile}
                bullet_position='bottom'
                active_bullet_color='var(--button-primary-default)'
            />
            <Modal.Footer>
                <Button
                    rounded
                    large
                    wide
                    tertiary={!is_last_slide}
                    primary={is_last_slide}
                    text={is_last_slide ? 'Get Started' : current_content.buttonLabel}
                    className={is_last_slide ? '' : 'wallets-migration-modal__button'}
                    onClick={handleButtonClick}
                />
            </Modal.Footer>
        </Modal>
    );
});

export default WalletMigrationModal;
