import React from 'react';
import { observer } from 'mobx-react-lite';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import TourGuide from 'Modules/tour-guide/tour-guide';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import { useStores } from 'Stores/index';
import { isDesktop, routes } from '@deriv/shared';
import { DesktopWrapper, MobileWrapper, ButtonToggle, Div100vhContainer } from '@deriv/components';

import './traders-hub.scss';

const TradersHub = () => {
    const { traders_hub, client } = useStores();
    const { is_eu, is_landing_company_loaded, is_logged_in } = client;
    const { selected_platform_type, setTogglePlatformType, is_tour_open } = traders_hub;
    const traders_hub_ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    const handleScroll = () => {
        const element = traders_hub_ref?.current;
        if (element && is_tour_open) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    React.useEffect(() => {
        setTimeout(() => {
            handleScroll();
        }, 500);
    }, [is_tour_open]);

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
    if (!is_logged_in) return null;
    return (
        <>
            <Div100vhContainer className='traders-hub--mobile' height_offset='50px' is_disabled={isDesktop()}>
                <div id='traders-hub' className='traders-hub' ref={traders_hub_ref}>
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
                    <TourGuide />
                </div>
            </Div100vhContainer>
        </>
    );
};

export default observer(TradersHub);
