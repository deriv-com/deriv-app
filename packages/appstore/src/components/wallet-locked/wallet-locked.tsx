import React from 'react';
import { LegacyInlineMessage, Text } from '@deriv/components';
import { useIsSystemMaintenance } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import getMessage from './wallet-locked-provider';
import type { TWallet } from 'Components/modals/wallet-modal/wallet-modal';
import './wallet-locked.scss';

type TWalletLocked = {
    is_mobile: boolean;
    wallet: TWallet;
};

const WalletLocked = observer(({ is_mobile, wallet }: TWalletLocked) => {
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
            {state?.type && <LegacyInlineMessage message={state?.title} type={state?.type} />}
        </div>
    );
});

export default WalletLocked;
