import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import classNames from 'classnames';
import { Button, Text, Modal, VideoPlayer } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useWalletMigration } from '@deriv/hooks';
import { SectionMessage } from '@deriv-com/ui';
import {
    getWalletMigrationVideoTranslations,
    WALLET_MIGRATION_VIDEO_TRANSLATIONS,
} from 'Constants/wallet-migration-video-translations';
import './wallets-upgrade-modal.scss';

const trackAnalyticsEvent = (
    action: TEvents['ce_tradershub_popup']['action'],
    account_mode: TEvents['ce_tradershub_popup']['account_mode']
) => {
    Analytics.trackEvent('ce_tradershub_popup', {
        action,
        form_name: 'ce_tradershub_popup',
        account_mode,
        popup_name: 'introducing_wallets_step_1',
        popup_type: 'with_cta',
    });
};

const WalletsUpgradeModal = observer(() => {
    const { traders_hub, ui, common } = useStore();
    const { current_language } = common;
    const { is_demo, is_real_wallets_upgrade_on, toggleWalletsUpgrade } = traders_hub;
    const { is_desktop, is_mobile } = ui;
    const { is_eligible, startMigration } = useWalletMigration();
    const account_mode = is_demo ? 'demo' : 'real';
    const isWalletMigrationModalClosed = localStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);
    const is_open = (is_eligible && modalOpen) || is_real_wallets_upgrade_on;

    const video_src = getWalletMigrationVideoTranslations(
        current_language as keyof typeof WALLET_MIGRATION_VIDEO_TRANSLATIONS
    );

    React.useEffect(() => {
        if (is_open) {
            trackAnalyticsEvent('open', account_mode);
        }
    }, [account_mode, is_open]);

    const closeModal = () => {
        setModalOpen(false);
        localStorage.setItem('is_wallet_migration_modal_closed', 'true');
        toggleWalletsUpgrade(false);
    };

    const handleMigration = () => {
        closeModal();
        startMigration();
        trackAnalyticsEvent('click_cta', account_mode);
    };

    const onToggleModalHandler = () => {
        closeModal();
        trackAnalyticsEvent('close', account_mode);
    };

    return (
        <Modal
            className='wallets-upgrade-modal'
            is_open={is_open}
            width={is_desktop ? '77.6rem' : '32.8rem'}
            title=' '
            toggleModal={onToggleModalHandler}
        >
            <Modal.Body>
                <div className='wallets-upgrade-modal__content'>
                    <div className='wallets-upgrade-modal__media-container'>
                        <VideoPlayer
                            height={is_desktop ? '311px' : '157px'}
                            is_mobile={is_mobile}
                            muted
                            src={video_src}
                        />
                    </div>
                    <div className='wallets-upgrade-modal__text'>
                        <Text align='center' size={is_desktop ? 'm' : 's'} weight='bold'>
                            <Localize i18n_default_text='Introducing Wallets' />
                        </Text>
                        <Text align='center' size={is_desktop ? 's' : 'xs'}>
                            <Localize
                                i18n_default_text='Use Wallets to manage your funds across different currencies effortlessly.'
                                components={[<br key={0} />]}
                            />
                        </Text>
                    </div>
                    <SectionMessage variant='info' className='wallets-upgrade-modal__disclaimer'>
                        <Text size='xs' className='wallets-upgrade-modal__disclaimer-message'>
                            <Localize i18n_default_text='Deriv P2P and Payment Agent services are currently unavailable for Wallets.' />
                        </Text>
                    </SectionMessage>
                </div>
                <div
                    className={classNames({
                        'wallets-upgrade-modal__footer--desktop': is_desktop,
                        'wallets-upgrade-modal__footer--mobile': !is_desktop,
                    })}
                >
                    <Button large={is_desktop} onClick={handleMigration} primary text={localize('Enable now')} />
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default WalletsUpgradeModal;
