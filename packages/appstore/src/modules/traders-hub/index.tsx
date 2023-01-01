import React from 'react';
import Joyride, { LIFECYCLE } from 'react-joyride';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import {
    tour_step_config,
    tour_styles,
    tour_step_locale,
    tour_styles_dark_mode,
    eu_tour_step_locale,
} from 'Constants/tour-steps-config-new';
import { useStores } from 'Stores/index';
import { isDesktop, routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, ButtonToggle, Div100vhContainer, Button } from '@deriv/components';

import './traders-hub.scss';

const TradersHub = () => {
    const { traders_hub, client, ui } = useStores();
    const { is_eu, is_landing_company_loaded } = client;
    const { selected_platform_type, setTogglePlatformType, is_tour_open, toggleIsTourOpen, setIsOnboardingVisited } =
        traders_hub;
    const { is_dark_mode_on } = ui;

    const history = useHistory();

    const [joyride_index, setJoyrideIndex] = React.useState<number>(0);

    const platform_toggle_options = [
        { text: `${is_eu ? 'Multipliers' : 'Options & Multipliers'}`, value: 'options' },
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

    tour_step_locale.last = (
        <div
            onClick={() => {
                setIsOnboardingVisited(true);
                toggleIsTourOpen(false);
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    eu_tour_step_locale.last = (
        <div
            onClick={() => {
                setIsOnboardingVisited(true);
                toggleIsTourOpen(false);
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    if (tour_step_config.length === joyride_index + 1) {
        tour_step_locale.back = (
            <Button
                has_effect
                text={localize('Repeat tour')}
                secondary
                medium
                onClick={() => {
                    history.push(routes.onboarding);
                    toggleIsTourOpen(true);
                }}
            />
        );
    }

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
                        {is_landing_company_loaded ? (
                            <ButtonToggle
                                buttons_arr={platform_toggle_options}
                                className='traders-hub__button-toggle'
                                has_rounded_button
                                is_traders_hub={window.location.pathname === routes.traders_hub}
                                name='platforn_type'
                                onChange={platformTypeChange}
                                value={selected_platform_type}
                            />
                        ) : (
                            <ButtonToggleLoader />
                        )}
                        {selected_platform_type === 'options' && <OptionsAndMultipliersListing />}
                        {selected_platform_type === 'cfd' && <CFDsListing />}
                    </MobileWrapper>
                    <ModalManager />
                    <Joyride
                        run={is_tour_open}
                        continuous
                        disableScrolling
                        hideCloseButton
                        disableCloseOnEsc
                        steps={tour_step_config}
                        styles={is_dark_mode_on ? tour_styles_dark_mode : tour_styles}
                        locale={tour_step_locale}
                        floaterProps={{
                            disableAnimation: true,
                        }}
                        callback={data => setJoyrideIndex(data.index)}
                    />
                </div>
            </Div100vhContainer>
        </>
    );
};

export default observer(TradersHub);
