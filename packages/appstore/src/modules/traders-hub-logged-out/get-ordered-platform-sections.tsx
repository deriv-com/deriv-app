import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import OptionsAndMultipliersListingLoggedOut from './options-miltipliers-listing-logged-out';
import CFDsListingLoggedOut from './cfds-listing-logged-out';

const OrderedPlatformSections = ({
    is_cfd_visible = true,
    is_options_and_multipliers_visible = true,
    is_eu_user = false,
}: {
    is_cfd_visible?: boolean;
    is_options_and_multipliers_visible?: boolean;
    is_eu_user?: boolean;
}) => (
    <div
        data-testid='dt_traders_hub'
        className={classNames('traders-hub__main-container', {
            'traders-hub__main-container-reversed': is_eu_user,
        })}
    >
        {is_options_and_multipliers_visible && <OptionsAndMultipliersListingLoggedOut />}
        {is_cfd_visible && <CFDsListingLoggedOut />}
    </div>
);

export const GetOrderedPlatformSections = observer(({ isDesktop = false }: { isDesktop?: boolean }) => {
    const { traders_hub, client } = useStore();
    const { is_mt5_allowed } = client;
    const { selected_platform_type } = traders_hub;

    if (is_mt5_allowed) {
        return isDesktop ? (
            <OrderedPlatformSections />
        ) : (
            <OrderedPlatformSections
                is_cfd_visible={selected_platform_type === 'cfd'}
                is_options_and_multipliers_visible={selected_platform_type === 'options'}
            />
        );
    }
    return <OrderedPlatformSections is_cfd_visible={false} is_options_and_multipliers_visible={true} />;
});
