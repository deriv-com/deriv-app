import WalletSteps from './wallet_steps';
import { TRealWalletsUpgradeSteps } from 'Types';

const WalletsUpgradeContent = ({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const wallet_steps_array = WalletSteps({ ...wallet_upgrade_steps });

    const { current_step } = wallet_upgrade_steps;

    return wallet_steps_array?.[current_step]?.component || wallet_steps_array?.[0].component;
};

export default WalletsUpgradeContent;
