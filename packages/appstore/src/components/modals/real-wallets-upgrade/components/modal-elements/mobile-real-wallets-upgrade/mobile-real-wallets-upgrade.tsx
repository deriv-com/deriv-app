import React from 'react';
import { MobileDialog, ProgressBarTracker, SwipeableWrapper } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TRealWalletsUpgradeSteps } from 'Types';
import WalletSteps from '../wallet_steps';
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
            wrapper_classname='mobile-real-wallets-upgrade'
            footer={
                <>
                    <div className='mobile-real-wallets-upgrade__footer-progress-bar-container'>
                        <ProgressBarTracker
                            step={current_step + 1}
                            steps_list={['why_wallets_step', 'enable_step']}
                            is_transition
                        />
                    </div>
                    {wallet_steps[current_step].footer}
                </>
            }
        >
            <div className='mobile-real-wallets-upgrade'>
                <SwipeableWrapper
                    onChange={(index: number) => {
                        if (typeof index !== 'number') return; // might be `undefined`
                        if (index > current_step) handleNext();
                        if (index < current_step) handleBack();
                    }}
                >
                    {wallet_steps.map(slide => slide.content)}
                </SwipeableWrapper>
            </div>
        </MobileDialog>
    );
});

export default MobileRealWalletsUpgrade;
