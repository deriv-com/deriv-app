import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from '@deriv/components';
import { routes, isDesktop } from '@deriv/shared';
import DerivLogoDark from 'Assets/SvgComponents/header/deriv-logo-dark.svg';
import DerivLogoDarkMobile from 'Assets/SvgComponents/header/deriv-logo-dark-mobile.svg';
import DerivLogoLight from 'Assets/SvgComponents/header/deriv-logo-light.svg';
import DerivLogoLightMobile from 'Assets/SvgComponents/header/deriv-logo-light-mobile.svg';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { observer, useStore } from '@deriv/stores';

const LoggedInHeader = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    const history = useHistory();

    const handleClick = () => history.push(routes.dashboard);

    const getDesktopHeaderLogo = () => (is_dark_mode_on ? <DerivLogoDark /> : <DerivLogoLight />);

    const getMobileHeaderLogo = () => (is_dark_mode_on ? <DerivLogoDarkMobile /> : <DerivLogoLightMobile />);

    return (
        <header className='dashboard-header dashboard-header--logged-in'>
            <div className='dashboard-header__left'>
                <div onClick={handleClick} onKeyDown={handleClick}>
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
});

export default LoggedInHeader;
