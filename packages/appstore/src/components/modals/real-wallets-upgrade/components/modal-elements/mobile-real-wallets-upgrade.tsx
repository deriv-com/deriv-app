import React from 'react';
import { MobileDialog, SwipeableWrapper } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TRealWalletsUpgradeSteps } from 'Types';
import WalletSteps from './wallet_steps';
import WalletsUpgradeFooter from './wallets-upgrade-footer';
import './mobile-real-wallets-upgrade.scss';

const MobileRealWalletsUpgrade = observer(({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const { traders_hub: is_real_wallets_upgrade_on } = useStore();

    const wallet_steps = WalletSteps(wallet_upgrade_steps);
    const { current_step, handleBack, handleNext } = wallet_upgrade_steps;

    return (
        <MobileDialog
            portal_element_id='modal_root'
            visible={is_real_wallets_upgrade_on}
            onClose={wallet_upgrade_steps.handleClose}
            wrapper_classname='wallet-steps'
            footer={<WalletsUpgradeFooter wallet_upgrade_steps={wallet_upgrade_steps} />}
        >
            <div className='mobile-real-wallets-upgrade'>
                <SwipeableWrapper
                    onChange={
                        (index => {
                            if (typeof index !== 'number') return;
                            if (index > current_step) handleNext();
                            if (index < current_step) handleBack();
                        }) as (index: number) => void
                    }
                >
                    {wallet_steps.map(slide => slide.component)}
                </SwipeableWrapper>
            </div>
        </MobileDialog>
    );
});

export default MobileRealWalletsUpgrade;
