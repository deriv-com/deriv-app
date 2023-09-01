import React from 'react';
import { useWalletMigration } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { DesktopRealWalletsUpgrade, MobileRealWalletsUpgrade } from './components/modal-elements';
import './real-wallets-upgrade.scss';

const RealWalletsUpgrade = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade } = traders_hub;
    const { is_mobile } = ui;

    const [current_step, setCurrentStep] = React.useState(0);
    const [is_disabled, setIsDisabled] = React.useState(false);

    React.useEffect(() => {
        if (!is_real_wallets_upgrade_on) {
            setCurrentStep(0);
            setIsDisabled(false);
        }
    }, [is_real_wallets_upgrade_on]);

    const handleNext = () => setCurrentStep(prev_step => prev_step + 1);

    const handleBack = () => setCurrentStep(prev_step => prev_step - 1);

    const handleClose = () => toggleWalletsUpgrade(false);

    const { start_migration } = useWalletMigration();

    const upgradeToWallets = () => {
        start_migration();
        toggleWalletsUpgrade(false);
    };

    const toggleCheckbox = () => {
        setIsDisabled(prevDisabled => !prevDisabled);
    };

    return (
        <React.Fragment>
            {is_mobile ? (
                <MobileRealWalletsUpgrade
                    current_step={current_step}
                    handleBack={handleBack}
                    handleClose={handleClose}
                    handleNext={handleNext}
                    is_disabled={is_disabled}
                    toggleCheckbox={toggleCheckbox}
                    upgradeToWallets={upgradeToWallets}
                />
            ) : (
                <DesktopRealWalletsUpgrade
                    current_step={current_step}
                    handleBack={handleBack}
                    handleClose={handleClose}
                    handleNext={handleNext}
                    is_disabled={is_disabled}
                    toggleCheckbox={toggleCheckbox}
                    upgradeToWallets={upgradeToWallets}
                />
            )}
        </React.Fragment>
    );
});

export default RealWalletsUpgrade;
