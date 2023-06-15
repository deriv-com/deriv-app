import React from 'react';
import { Icon, LegacyInlineMessage, Text } from '@deriv/components';
import { useIsSystemMaintenance } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import getMessage from './wallet-locked-provider';
import type { TWallet } from 'Components/modals/wallet-modal/wallet-modal';
import './wallet-locked.scss';

type TWalletLocked = {
    wallet: TWallet;
};

const WalletLocked = observer(({ wallet }: TWalletLocked) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const is_system_maintenance = useIsSystemMaintenance();

    const state = getMessage({
        is_crypto: wallet.is_crypto,
        is_system_maintenance,
        wallet_name: wallet.name,
    });

    return (
        <div className='wallet-locked'>
            <div className='wallet-locked__state'>
                {state?.title && (
                    <Text
                        as='p'
                        align='center'
                        className='wallet-locked__state__title'
                        data-testid='dt_wallet_locked_state_title'
                        size={is_mobile ? 's' : 'sm'}
                        weight='bold'
                    >
                        {state?.title}
                    </Text>
                )}
                {state?.description && (
                    <Text
                        as='p'
                        align='center'
                        className='wallet-locked__state__desc'
                        color='primary'
                        data-testid='dt_wallet_locked_state_description'
                        size={is_mobile ? 'xs' : 's'}
                    >
                        {state?.description}
                    </Text>
                )}
            </div>
            <LegacyInlineMessage message={state?.title} type={state?.type} />
        </div>
    );
});

export default WalletLocked;
