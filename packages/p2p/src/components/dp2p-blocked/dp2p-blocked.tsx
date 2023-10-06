import React from 'react';

import { Icon, Text } from '@deriv/components';

import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';

import Dp2pBlockedChecklist from './dp2p-blocked-checklist';
import Dp2pBlockedDescription from './dp2p-blocked-description';

const Dp2pBlocked = () => {
    const { general_store } = useStores();

    return (
        <div className='dp2p-blocked' data-testid='dt_dp2p-blocked-container'>
            <Icon icon='IcCashierDp2pBlocked' size={128} />
            <Text className='dp2p-blocked__title' color='prominent' weight='bold'>
                {general_store.should_show_poa ? (
                    <Localize i18n_default_text='We need your documents' />
                ) : (
                    <Localize i18n_default_text='Your Deriv P2P cashier is blocked' />
                )}
            </Text>
            <Dp2pBlockedDescription />
            <Dp2pBlockedChecklist />
        </div>
    );
};

export default Dp2pBlocked;
