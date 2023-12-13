import * as React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Text } from '@deriv/components';
import { PlatformContext, redirectToLogin, redirectToSignUp, routes, isDesktop, isMobile } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import DerivLogo from 'Assets/SvgComponents/header/deriv-logo.svg';
import DerivLogoDark from 'Assets/SvgComponents/header/deriv-logo-dark.svg';
import DerivLogoDarkMobile from 'Assets/SvgComponents/header/deriv-logo-dark-mobile.svg';
import DerivLogoLight from 'Assets/SvgComponents/header/deriv-logo-light.svg';
import DerivLogoLightMobile from 'Assets/SvgComponents/header/deriv-logo-light-mobile.svg';
import DerivLogoText from 'Assets/SvgComponents/header/deriv-logo-text.svg';
import DerivText from 'Assets/SvgComponents/header/deriv-text.svg';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import HeaderItemsLoader from '../../../Components/Layout/Header/Components/Preloader/header-items.jsx';

const LoggedInHeader = ({ is_dark_mode }) => {
    const history = useHistory();

    const getDesktopHeaderLogo = () => (!is_dark_mode ? <DerivLogoLight /> : <DerivLogoDark />);

    const getMobileHeaderLogo = () => (!is_dark_mode ? <DerivLogoLightMobile /> : <DerivLogoDarkMobile />);

    return (
        <header className='dashboard-header dashboard-header--logged-in'>
            <div className='dashboard-header__left'>
                <div onClick={() => history.push(routes.dashboard)}>
                    {isDesktop() ? getDesktopHeaderLogo() : getMobileHeaderLogo()}
                </div>
            </div>
            <div className='dashboard-header__right--logged-in'>
                {isDesktop() ? (
                    <React.Fragment>
                        <Icon icon={'IcProfile'} size={32} className='dashboard-header__right--logged-in-icon' />
                        <Icon icon={'IcNotification'} size={32} />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Icon icon={'IcNotificationClear'} height={20} width={17} />
                        <div className='dashboard-header__right--logged-in-separator' />
                        <ToggleMenuDrawer />
                    </React.Fragment>
                )}
            </div>
        </header>
    );
};

const LoggedOutHeader = () => {
    const history = useHistory();
    const { is_appstore } = React.useContext(PlatformContext);

    return (
        <header className='dashboard-header dashboard-header--logged-out'>
            <div className='dashboard-header__left'>
                <div onClick={() => history.push(routes.dashboard)}>
                    {isDesktop() ? (
                        <React.Fragment>
                            <DerivLogo className='dashboard-header__left--desktop-logo' />
                            <DerivText />
                        </React.Fragment>
                    ) : (
                        <DerivLogoText />
                    )}
                </div>
            </div>
            <div className='dashboard-header__middle--logged-out'>
                <Text color='colored-background' size='s' onClick={() => history.push(routes.explore)}>
                    {localize('Explore')}
                </Text>
                <Text color='colored-background' size='s' onClick={() => history.push(routes.about_us)}>
                    {localize('About us')}
                </Text>
                <Text color='colored-background' size='s' onClick={() => history.push(routes.resources)}>
                    {localize('Resources')}
                </Text>
            </div>
            <div className='dashboard-header__right--logged-out'>
                <Button.Group>
                    <Button
                        alternate
                        has_effect
                        text={localize('Log in')}
                        onClick={() => redirectToLogin(false, getLanguage())}
                    />
                    <Button
                        className='dashboard-header__right--create-button'
                        primary
                        text={localize('Create free demo account')}
                        onClick={() => redirectToSignUp({ is_appstore })}
                    />
                </Button.Group>
                {isMobile() && (
                    <React.Fragment>
                        <div className='dashboard-header__right--logged-out-separator' />
                        <ToggleMenuDrawer />
                    </React.Fragment>
                )}
            </div>
        </header>
    );
};

const HeaderPreloader = () => (
    <div className={'dashboard-header__preloader'}>
        <HeaderItemsLoader speed={3} />
    </div>
);

const DashboardHeader = ({ is_dark_mode, is_logged_in, is_logging_in }) => {
    if (is_logging_in) {
        return <HeaderPreloader />;
    }

    if (is_logged_in) {
        return <LoggedInHeader is_dark_mode={is_dark_mode} />;
    }

    return <LoggedOutHeader />;
};

DashboardHeader.propTypes = {
    is_dark_mode: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
};

export default connect(({ client, ui }) => ({
    is_dark_mode: ui.is_dark_mode_on,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
}))(DashboardHeader);
