import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import WalletSteps from './wallet_steps';
import { TModalContentFooter } from 'Types';

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
            {localize('Back')}
        </Button>
        <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
            {localize('Next')}
        </Button>
    </Modal.Footer>
);

export const InitialFooter = ({ handleClose, handleNext }: TInitialFooter) => (
    <Modal.Footer className='wallet-steps__footer' has_separator>
        <Button secondary large className='wallet-steps__footer-button' onClick={handleClose}>
            {localize('Maybe later')}
        </Button>
        <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
            {localize('Next')}
        </Button>
    </Modal.Footer>
);

export const EndFooter = ({ handleBack, is_disabled, upgradeToWallets }: TEndFooter) => (
    <Modal.Footer className='wallet-steps__footer' has_separator>
        <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
            {localize('Back')}
        </Button>
        <Button
            primary
            large
            className='wallet-steps__footer-button'
            disabled={!is_disabled}
            onClick={upgradeToWallets}
        >
            {localize('Upgrade to Wallets')}
        </Button>
    </Modal.Footer>
);

const WalletsUpgradeFooter = ({
    current_step,
    handleBack,
    handleClose,
    handleNext,
    is_disabled,
    toggleCheckbox,
    upgradeToWallets,
}: TModalContentFooter) => {
    const wallet_steps_array = WalletSteps({
        handleBack,
        handleClose,
        handleNext,
        is_disabled,
        toggleCheckbox,
        upgradeToWallets,
    });
    return (
        wallet_steps_array?.[current_step]?.footer || <DefaultFooter handleBack={handleBack} handleNext={handleNext} />
    );
};

export default WalletsUpgradeFooter;
