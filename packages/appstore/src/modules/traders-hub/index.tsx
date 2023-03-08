import React, { useCallback } from 'react';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import TourGuide from 'Modules/tour-guide/tour-guide';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import { isDesktop, routes, ContentFlag, isMobile } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { DesktopWrapper, MobileWrapper, ButtonToggle, Div100vhContainer, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import './traders-hub.scss';

const TradersHub = observer(() => {
    const [scrolled, setScrolled] = React.useState(false);
    const traders_hub_ref = React.useRef<HTMLDivElement>(null);
    const { traders_hub, client, ui } = useStore();
    const { notification_messages_ui: Notifications } = ui;
    const { is_logged_in, is_switching, is_logging_in, is_account_setting_loaded, is_landing_company_loaded } = client;
    const { selected_platform_type, setTogglePlatformType, is_tour_open, content_flag, is_eu_user } = traders_hub;
    const can_show_notify = !is_switching && !is_logging_in && is_account_setting_loaded && is_landing_company_loaded;
    const eu_title = content_flag === ContentFlag.EU_DEMO || content_flag === ContentFlag.EU_REAL || is_eu_user;
    const is_eu_low_risk = content_flag === ContentFlag.LOW_RISK_CR_EU;
    const platform_toggle_options = [
        { text: `${eu_title ? 'Multipliers' : 'Options & Multipliers'}`, value: 'options' },
        { text: 'CFDs', value: 'cfd' },
    ];

    React.useEffect(() => {
        const handleScroll = () => {
            const element = traders_hub_ref?.current;

            if (element && is_tour_open) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        setTimeout(() => {
            handleScroll();
            setTimeout(() => {
                setScrolled(true);
            }, 200);
        }, 100);
    }, [is_tour_open]);

    const platformTypeChange = (event: { target: { value: string; name: string } }) => {
        setTogglePlatformType(event.target.value);
    };

    const EUDisclaimer = useCallback(() => {
        return (
            <div className='disclaimer'>
                <Text align='left' className='disclaimer-text' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='<0>EU statutory disclaimer</0>: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>71% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
                        components={[<strong key={0} />]}
                    />
                </Text>
            </div>
        );
    }, []);

    if (!is_logged_in) return <></>;

    return (
        <>
            <Div100vhContainer
                className={classNames('traders-hub--mobile', { 'traders-hub--mobile--eu-user': is_eu_user })}
                height_offset='50px'
                is_disabled={isDesktop()}
            >
                {can_show_notify && Notifications && <Notifications />}
                <div id='traders-hub' className='traders-hub' ref={traders_hub_ref}>
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
                            name='platform_type'
                            onChange={platformTypeChange}
                            value={selected_platform_type}
                        />
                        {selected_platform_type === 'options' && <OptionsAndMultipliersListing />}
                        {selected_platform_type === 'cfd' && <CFDsListing />}
                    </MobileWrapper>
                    <ModalManager />
                    {scrolled && <TourGuide />}
                </div>
            </Div100vhContainer>
            {is_eu_low_risk && <EUDisclaimer />}
        </>
    );
});

export default TradersHub;
