import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { ButtonToggle, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isEuCountry } from '@deriv/shared';
import { getPlatformToggleOptions } from '../../helpers';

export const TabsOrTitle = observer(() => {
    const { traders_hub, client } = useStore();
    const { is_mt5_allowed, clients_country } = client;
    const { selected_platform_type, setTogglePlatformType } = traders_hub;

    const is_eu_user = isEuCountry(clients_country);

    const platform_toggle_options = getPlatformToggleOptions(is_eu_user);
    const platform_toggle_options_eu = getPlatformToggleOptions(is_eu_user).reverse();

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setTogglePlatformType(event.target.value);
    };

    return is_mt5_allowed ? (
        <ButtonToggle
            buttons_arr={is_eu_user ? platform_toggle_options_eu : platform_toggle_options}
            className='traders-hub-logged-out__button-toggle'
            has_rounded_button
            is_traders_hub
            name='platform_type'
            onChange={platformTypeChange}
            value={selected_platform_type}
        />
    ) : (
        <div className='traders-hub-logged-out__mt5-not-allowed'>
            <Text size='s' weight='bold' color='prominent'>
                <Localize i18n_default_text='Multipliers' />
            </Text>
        </div>
    );
});
