import React from 'react';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { ButtonToggle, Div100vhContainer, DesktopWrapper, MobileWrapper, Text, Loading } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { ContentFlag, routes } from '@deriv/shared';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import CFDsListing from 'Components/cfds-listing';
import './traders-hub-logged-out.scss';

const TradersHubLoggedOut = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const { openRealAccountSignup, is_from_signup_account, is_desktop, is_mobile, setIsFromSignupAccount } = ui;
    const {
        is_landing_company_loaded,
        is_logged_in,
        is_switching,
        is_logging_in,
        is_account_setting_loaded,
        is_mt5_allowed,
        has_active_real_account,
        website_status,
    } = client;
    const { selected_platform_type, setTogglePlatformType, is_tour_open, content_flag, is_eu_user } = traders_hub;
    const traders_hub_ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (is_eu_user) setTogglePlatformType('cfd');
        if (
            !has_active_real_account &&
            is_logged_in &&
            is_from_signup_account &&
            content_flag === ContentFlag.EU_DEMO
        ) {
            openRealAccountSignup('maltainvest');
            setIsFromSignupAccount(false);
        }
    }, [
        content_flag,
        has_active_real_account,
        is_eu_user,
        is_from_signup_account,
        is_logged_in,
        openRealAccountSignup,
        setIsFromSignupAccount,
        setTogglePlatformType,
    ]);

    const eu_title = content_flag === ContentFlag.EU_DEMO || content_flag === ContentFlag.EU_REAL || is_eu_user;

    const getPlatformToggleOptions = () => [
        { text: eu_title ? localize('Multipliers') : localize('Options & Multipliers'), value: 'options' },
        { text: localize('CFDs'), value: 'cfd' },
    ];
    const platform_toggle_options = getPlatformToggleOptions();
    const platform_toggle_options_eu = getPlatformToggleOptions().reverse();

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setTogglePlatformType(event.target.value);
    };

    const OrderedPlatformSections = ({ is_cfd_visible = true, is_options_and_multipliers_visible = true }) => {
        return (
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
    };

    const getOrderedPlatformSections = (isDesktop = false) => {
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
    };

    if (!website_status) return <Loading is_fullscreen />;

    if (is_logged_in) return <Redirect to={routes.traders_hub} />;

    return (
        <Div100vhContainer className='traders-hub--mobile' height_offset='50px' is_disabled={is_desktop}>
            <div
                id='traders-hub-logged-out'
                className={classNames('traders-hub-logged-out', {
                    'traders-hub--eu-user': is_eu_user && is_mt5_allowed,
                    'traders-hub--eu-user-without-mt5': is_eu_user && !is_mt5_allowed,
                })}
                ref={traders_hub_ref}
            >
                <DesktopWrapper>{getOrderedPlatformSections(true)}</DesktopWrapper>
                <MobileWrapper>
                    {is_mt5_allowed &&
                        (is_landing_company_loaded ? (
                            <ButtonToggle
                                buttons_arr={is_eu_user ? platform_toggle_options_eu : platform_toggle_options}
                                className='traders-hub__button-toggle'
                                has_rounded_button
                                is_traders_hub={window.location.pathname === routes.traders_hub}
                                name='platforn_type'
                                onChange={platformTypeChange}
                                value={selected_platform_type}
                            />
                        ) : (
                            <ButtonToggleLoader />
                        ))}
                    {!is_mt5_allowed && (
                        <div className='traders-hub--mt5-not-allowed'>
                            <Text size='s' weight='bold' color='prominent'>
                                <Localize i18n_default_text='Multipliers' />
                            </Text>
                        </div>
                    )}
                    {getOrderedPlatformSections()}
                </MobileWrapper>
            </div>
        </Div100vhContainer>
    );

    // return (
    //     <React.Fragment>
    //         <h1>Its logged out version of TH</h1>
    //     </React.Fragment>
    // );
});

export default TradersHubLoggedOut;
