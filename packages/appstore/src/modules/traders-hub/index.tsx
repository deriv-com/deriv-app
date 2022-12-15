import React from 'react';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import './traders-hub.scss';
import { DesktopWrapper, MobileWrapper, ButtonToggle, Div100vhContainer } from '@deriv/components';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import { isDesktop } from '@deriv/shared';

const TradersHub = () => {
    const { tradinghub, client } = useStores();
    const platform_toggle_options = [
        { text: `${client.is_eu ? 'Multipliers' : 'Options & Multipliers'}`, value: 'options' },
        { text: 'CFD', value: 'cfd' },
    ];

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        tradinghub.setTogglePlatformType(event.target.value);
    };
    return (
        <>
            <div id='traders-hub' className='traders-hub'>
                <Div100vhContainer className='traders-hub--mobile' height_offset='50px' is_disabled={isDesktop()}>
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
                            is_animated
                            name='platforn_type'
                            onChange={platformTypeChange}
                            value={tradinghub.selected_platform_type}
                        />
                        {tradinghub.selected_platform_type === 'options' && <OptionsAndMultipliersListing />}
                        {tradinghub.selected_platform_type === 'cfd' && <CFDsListing />}
                    </MobileWrapper>
                    <ModalManager />
                </Div100vhContainer>
            </div>
        </>
    );
};

export default observer(TradersHub);
