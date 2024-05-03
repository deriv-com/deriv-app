import React from 'react';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { Div100vhContainer, DesktopWrapper, MobileWrapper, Loading, Text } from '@deriv/components';
import { routes, isEuCountry } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import OrderedPlatformSections from 'Components/ordered-platform-sections';
import GetStartedTradingBanner from 'Components/get-started-trading-banner';
import TabsOrTitle from 'Components/tabs-or-title';
import './traders-hub-logged-out.scss';

const TradersHubLoggedOut = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const { is_desktop } = ui;
    const { is_logged_in, is_mt5_allowed, clients_country, is_landing_company_loaded, getLandingCompany } = client;
    const { setTogglePlatformType, selectRegion, is_eu_user } = traders_hub;

    React.useEffect(() => {
        if (clients_country) {
            getLandingCompany(clients_country);
            if (isEuCountry(clients_country)) {
                setTogglePlatformType('cfd');
                selectRegion('EU');
            } else {
                selectRegion('Non-EU');
            }
        }
    }, [clients_country, getLandingCompany, setTogglePlatformType]);

    if (!clients_country || !is_landing_company_loaded) return <Loading is_fullscreen />;

    if (is_logged_in) return <Redirect to={routes.traders_hub} />;

    return (
        <Div100vhContainer className='traders-hub-logged-out__mobile' height_offset='50px' is_disabled={is_desktop}>
            <div
                className={classNames('traders-hub-logged-out', {
                    'traders-hub-logged-out__eu-user': is_eu_user && is_mt5_allowed,
                    'traders-hub-logged-out__eu-user-without-mt5': is_eu_user && !is_mt5_allowed,
                })}
            >
                <GetStartedTradingBanner />
                <Text size={is_desktop ? 'm' : 'xsm'} weight='bold' color='prominent'>
                    <Localize i18n_default_text="Trader's Hub" />
                </Text>
                <DesktopWrapper>
                    <OrderedPlatformSections isDesktop />
                </DesktopWrapper>
                <MobileWrapper>
                    <TabsOrTitle />
                    <OrderedPlatformSections />
                </MobileWrapper>
            </div>
        </Div100vhContainer>
    );
});

export default TradersHubLoggedOut;
