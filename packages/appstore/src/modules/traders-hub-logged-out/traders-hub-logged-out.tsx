import React from 'react';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { ButtonToggle, Div100vhContainer, DesktopWrapper, MobileWrapper, Text, Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { routes, isEuCountry } from '@deriv/shared';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import CFDsListing from 'Components/cfds-listing';
import TrustpilotWidget from 'Components/trustpilot-widget';
import { getPlatformToggleOptions } from '../../helpers';
import './traders-hub-logged-out.scss';

const GetOrderedPlatformSections = observer(({ isDesktop = false }: { isDesktop?: boolean }) => {
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
        {is_options_and_multipliers_visible && <OptionsAndMultipliersListing />}
        {is_cfd_visible && <CFDsListing />}
    </div>
);

const TabsOrTitle = observer(() => {
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

const TradersHubLoggedOut = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const { is_desktop } = ui;
    const {
        is_logged_in,
        is_mt5_allowed,
        // website_status,
        clients_country,
    } = client;
    const { setTogglePlatformType } = traders_hub;

    const is_eu_user = isEuCountry(clients_country);

    React.useEffect(() => {
        if (is_eu_user) setTogglePlatformType('cfd');
    }, [is_eu_user, setTogglePlatformType]);

    if (!clients_country) return <Loading is_fullscreen />;

    if (is_logged_in) return <Redirect to={routes.traders_hub} />;

    return (
        <Div100vhContainer className='traders-hub-logged-out__mobile' height_offset='50px' is_disabled={is_desktop}>
            <div
                id='traders-hub-logged-out'
                className={classNames('traders-hub-logged-out', {
                    'traders-hub-logged-out__eu-user': is_eu_user && is_mt5_allowed,
                    'traders-hub-logged-out__eu-user-without-mt5': is_eu_user && !is_mt5_allowed,
                })}
            >
                <DesktopWrapper>
                    <TrustpilotWidget />
                    <GetOrderedPlatformSections isDesktop />
                </DesktopWrapper>
                <MobileWrapper>
                    <TabsOrTitle />
                    <GetOrderedPlatformSections />
                </MobileWrapper>
            </div>
        </Div100vhContainer>
    );
});

export default TradersHubLoggedOut;
