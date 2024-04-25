import React from 'react';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { Div100vhContainer, DesktopWrapper, MobileWrapper, Loading } from '@deriv/components';
import { routes, isEuCountry } from '@deriv/shared';
import TrustpilotWidget from 'Components/trustpilot-widget';
import { GetOrderedPlatformSections } from './get-ordered-platform-sections';
import { TabsOrTitle } from './tabs-or-title';
import './traders-hub-logged-out.scss';

const TradersHubLoggedOut = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const { is_desktop } = ui;
    const { is_logged_in, is_mt5_allowed, clients_country } = client;
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
