/*
// This file will be removed from code after releasing the wallets project
*/

import React from 'react';
import { DesktopWrapper, MobileWrapper, ButtonToggle } from '@deriv/components';
import { ContentFlag, routes } from '@deriv/shared';
import MainTitleBar from 'Components/main-title-bar';
import CFDsListing from 'Components/cfds-listing';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import { useStore, observer } from '@deriv/stores';

const AccountWithoutWallets = observer(() => {
    const { traders_hub, client } = useStore();
    const { is_landing_company_loaded } = client;
    const { selected_platform_type, setTogglePlatformType, content_flag, is_eu_user } = traders_hub;

    const eu_title = content_flag === ContentFlag.EU_DEMO || content_flag === ContentFlag.EU_REAL || is_eu_user;

    const platform_toggle_options = [
        { text: `${eu_title ? 'Multipliers' : 'Options & Multipliers'}`, value: 'options' },
        { text: 'CFDs', value: 'cfd' },
    ];

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setTogglePlatformType(event.target.value);
    };

    return (
        <React.Fragment>
            <MainTitleBar />
            <DesktopWrapper>
                <div className='traders-hub__main-container'>
                    <OptionsAndMultipliersListing />
                    <CFDsListing />
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                {is_landing_company_loaded ? (
                    <ButtonToggle
                        buttons_arr={platform_toggle_options}
                        className='traders-hub__button-toggle'
                        has_rounded_button
                        is_traders_hub={window.location.pathname === routes.traders_hub}
                        name='platform_type'
                        onChange={platformTypeChange}
                        value={selected_platform_type}
                    />
                ) : (
                    <ButtonToggleLoader />
                )}
                {selected_platform_type === 'options' && <OptionsAndMultipliersListing />}
                {selected_platform_type === 'cfd' && <CFDsListing />}
            </MobileWrapper>
        </React.Fragment>
    );
});

export default AccountWithoutWallets;
