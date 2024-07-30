import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import classNames from 'classnames';
import { Stream } from '@cloudflare/stream-react';
import { Button, Text, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useWalletMigration } from '@deriv/hooks';
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
    const { traders_hub, ui } = useStore();
    const { is_demo, is_real_wallets_upgrade_on, toggleWalletsUpgrade } = traders_hub;
    const { is_desktop } = ui;
    const { is_eligible, startMigration } = useWalletMigration();
    const account_mode = is_demo ? 'demo' : 'real';
    const isWalletMigrationModalClosed = localStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);
    const is_open = (is_eligible && modalOpen) || is_real_wallets_upgrade_on;

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
                        <Stream
                            autoplay
                            className='wallets-upgrade-modal__video'
                            controls
                            letterboxColor='transparent'
                            loop
                            muted
                            preload='auto'
                            responsive={false}
                            src='25df7df0d0af48090b086cd6f103d8f3'
                            width='100%'
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
