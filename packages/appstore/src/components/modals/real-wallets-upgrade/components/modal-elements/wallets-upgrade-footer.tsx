import React from 'react';
import { Button, Modal, ProgressBarTracker } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import WalletSteps from './wallet_steps';
import { TRealWalletsUpgradeSteps } from 'Types';
import './wallets-upgrade-footer.scss';

type TWhyWalletsFooter = {
    handleClose: VoidFunction;
    handleNext: VoidFunction;
};

type TReadyToEnableWalletsFooter = {
    handleBack: VoidFunction;
    is_disabled: boolean;
    upgradeToWallets: (value: boolean) => void;
};

export const WhyWalletsFooter = ({ handleNext }: TWhyWalletsFooter) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    return is_desktop ? (
        <Modal.Footer className='wallet-steps__footer' has_separator>
            <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
                <Localize i18n_default_text='Next' />
            </Button>
        </Modal.Footer>
    ) : null;
};

export const ReadyToEnableWalletsFooter = ({
    handleBack,
    is_disabled,
    upgradeToWallets,
}: TReadyToEnableWalletsFooter) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    return (
        <Modal.Footer className='wallet-steps__footer' has_separator>
            {is_desktop && (
                <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
                    <Localize i18n_default_text='Back' />
                </Button>
            )}
            <Button
                primary
                large
                className='wallet-steps__footer-button'
                disabled={!is_disabled}
                onClick={upgradeToWallets}
            >
                <Localize i18n_default_text='Enable' />
            </Button>
        </Modal.Footer>
    );
};

const WalletsUpgradeFooter = ({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const wallet_steps_array = WalletSteps({ ...wallet_upgrade_steps });
    const { current_step } = wallet_upgrade_steps;

    return (
        <>
            {is_mobile && (
                <div className='wallets-upgrade-footer__mobile-progress-bar-container'>
                    <ProgressBarTracker
                        step={current_step + 1}
                        steps_list={['why_wallets_step', 'enable_step']}
                        is_transition
                    />
                </div>
            )}

            {wallet_steps_array?.[current_step]?.footer}
        </>
    );
};

export default WalletsUpgradeFooter;
