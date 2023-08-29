import WalletSteps from './wallet_steps';
import { TModalContentFooter } from 'Types';

const WalletsUpgradeContent = ({
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

    return wallet_steps_array?.[current_step]?.component || wallet_steps_array?.[0].component;
};

export default WalletsUpgradeContent;
