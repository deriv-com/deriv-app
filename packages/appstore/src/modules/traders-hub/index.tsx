import React from 'react';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import './traders-hub.scss';
import { DesktopWrapper, MobileWrapper, ButtonToggle, Div100vhContainer } from '@deriv/components';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import { isDesktop, routes } from '@deriv/shared';

const TradersHub = () => {
    const { traders_hub, client } = useStores();
    const { is_eu } = client;
    const { selected_platform_type, setTogglePlatformType } = traders_hub;

    const platform_toggle_options = [
        { text: `${is_eu ? 'Multipliers' : 'Options & Multipliers'}`, value: 'options' },
        { text: 'CFD', value: 'cfd' },
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
        <>
            <Div100vhContainer className='traders-hub--mobile' height_offset='50px' is_disabled={isDesktop()}>
                <div id='traders-hub' className='traders-hub'>
                    <MainTitleBar />
                    <DesktopWrapper>
                        <div className='traders-hub__main-container'>
                            <OptionsAndMultipliersListing />
                            <CFDsListing />
                        </div>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ButtonToggle
                            buttons_arr={platform_toggle_options}
                            className='traders-hub__button-toggle'
                            has_rounded_button
                            is_traders_hub={window.location.pathname === routes.traders_hub}
                            name='platforn_type'
                            onChange={platformTypeChange}
                            value={selected_platform_type}
                        />
                        {selected_platform_type === 'options' && <OptionsAndMultipliersListing />}
                        {selected_platform_type === 'cfd' && <CFDsListing />}
                    </MobileWrapper>
                    <ModalManager />
                </div>
            </Div100vhContainer>
        </>
    );
};

export default observer(TradersHub);
