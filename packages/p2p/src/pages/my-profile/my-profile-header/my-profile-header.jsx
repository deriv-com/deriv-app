import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ButtonToggle } from '@deriv/components';
import ToggleContainer from 'Components/misc/toggle-container.jsx';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';

const MyProfileHeader = () => {
    const { my_profile_store } = useStores();

    const getMyProfileTabFilters = () => [
        {
            text: localize('Stats'),
            value: my_profile_tabs.MY_STATS,
        },
        {
            text: localize('Payment methods'),
            value: my_profile_tabs.PAYMENT_METHODS,
        },
        {
            text: localize('Ad details'),
            value: my_profile_tabs.AD_TEMPLATE,
        },
        {
            text: localize('Blocked advertisers'),
            value: my_profile_tabs.BLOCKED_ADVERTISERS,
        },
    ];

    const onChangeTab = event => my_profile_store.setActiveTab(event.target.value);

    return (
        <ToggleContainer>
            <ButtonToggle
                buttons_arr={getMyProfileTabFilters()}
                className='my-profile-header'
                is_animated
                name='profile-header'
                onChange={onChangeTab}
                value={my_profile_store.active_tab}
                has_rounded_button
            />
        </ToggleContainer>
    );
};

export default observer(MyProfileHeader);
