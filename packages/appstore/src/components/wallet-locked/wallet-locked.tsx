import React from 'react';
import { Icon, Text } from '@deriv/components';
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
        <>
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
            <div className='wallet-locked__alert-message'>
                <div className='wallet-locked__alert-message__wrapper'>
                    <Icon icon='IcWalletWarning' />
                    <Text align='left' size={is_mobile ? 'xxs' : 'xs'}>
                        {state?.title}
                    </Text>
                </div>
            </div>
        </>
    );
});

export default WalletLocked;
