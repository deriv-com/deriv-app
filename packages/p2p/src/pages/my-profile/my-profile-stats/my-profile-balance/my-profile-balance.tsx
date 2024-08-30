import React from 'react';
import { Icon, Money, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { getIconSize, getTextSize } from 'Utils/responsive';

const MyProfileBalance = () => {
    const { general_store } = useStores();
    const {
        client: { currency },
    } = useStore();
    const { isMobile } = useDevice();
    const { showModal } = useModalManagerContext() || {};

    return (
        <div className='my-profile-balance'>
            <div className='my-profile-balance__column'>
                <div className='my-profile-balance__row'>
                    <Text color='less-prominent' size={getTextSize('xxxs', 'xs', isMobile)}>
                        <Localize i18n_default_text='Available Deriv P2P balance' />
                    </Text>
                    <Icon
                        className='my-profile-balance__icon'
                        color='disabled'
                        data_testid='dt_my_profile_balance_icon'
                        icon='IcInfoOutline'
                        onClick={() =>
                            showModal({
                                key: 'MyProfileBalanceModal',
                            })
                        }
                        size={getIconSize(12, 16, isMobile)}
                    />
                </div>
                <Text className='my-profile-balance__amount' color='prominent' size='m' weight='bold'>
                    <Money amount={general_store.advertiser_info.balance_available} currency={currency} show_currency />
                </Text>
            </div>
        </div>
    );
};

export default observer(MyProfileBalance);
