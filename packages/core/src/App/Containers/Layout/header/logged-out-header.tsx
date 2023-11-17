import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Text } from '@deriv/components';
import { redirectToLogin, redirectToSignUp, routes, isDesktop } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import DerivLogo from 'Assets/SvgComponents/header/deriv-logo.svg';
import DerivLogoText from 'Assets/SvgComponents/header/deriv-logo-text.svg';
import DerivText from 'Assets/SvgComponents/header/deriv-text.svg';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { observer, useStore } from '@deriv/stores';

const LoggedOutHeader = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const history = useHistory();

    const handleClick = () => history.push(routes.dashboard);

    return (
        <header className='dashboard-header dashboard-header--logged-out'>
            <div className='dashboard-header__left'>
                <div onClick={handleClick} onKeyDown={handleClick}>
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
                        onClick={() => redirectToSignUp({})}
                    />
                </Button.Group>
                {is_mobile && (
                    <React.Fragment>
                        <div className='dashboard-header__right--logged-out-separator' />
                        <ToggleMenuDrawer />
                    </React.Fragment>
                )}
            </div>
        </header>
    );
});

export default LoggedOutHeader;
