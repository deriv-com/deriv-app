import React from 'react';
import { Button, Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletSteps from './wallet_steps';
import { TRealWalletsUpgradeSteps } from 'Types';

type TDefaultFooter = {
    handleBack: () => void;
    handleNext: () => void;
};

type TInitialFooter = {
    handleClose: () => void;
    handleNext: () => void;
};

type TEndFooter = {
    handleBack: () => void;
    is_disabled: boolean;
    upgradeToWallets: (value: boolean) => void;
};

export const DefaultFooter = ({ handleBack, handleNext }: TDefaultFooter) => (
    <Modal.Footer className='wallet-steps__footer' has_separator>
        <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
            <Localize i18n_default_text='Back' />
        </Button>
        <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
            <Localize i18n_default_text='Next' />
        </Button>
    </Modal.Footer>
);

export const InitialFooter = ({ handleClose, handleNext }: TInitialFooter) => (
    <Modal.Footer className='wallet-steps__footer' has_separator>
        <Button secondary large className='wallet-steps__footer-button' onClick={handleClose}>
            <Localize i18n_default_text='Maybe later' />
        </Button>
        <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
            <Localize i18n_default_text='Next' />
        </Button>
    </Modal.Footer>
);

export const EndFooter = ({ handleBack, is_disabled, upgradeToWallets }: TEndFooter) => (
    <Modal.Footer className='wallet-steps__footer' has_separator>
        <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
            <Localize i18n_default_text='Back' />
        </Button>
        <Button
            primary
            large
            className='wallet-steps__footer-button'
            disabled={!is_disabled}
            onClick={upgradeToWallets}
        >
            <Localize i18n_default_text='Upgrade to Wallets' />
        </Button>
    </Modal.Footer>
);

const WalletsUpgradeFooter = ({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const wallet_steps_array = WalletSteps({ ...wallet_upgrade_steps });

    const { current_step, handleBack, handleNext } = wallet_upgrade_steps;

    return (
        wallet_steps_array?.[current_step]?.footer || <DefaultFooter handleBack={handleBack} handleNext={handleNext} />
    );
};

export default WalletsUpgradeFooter;
