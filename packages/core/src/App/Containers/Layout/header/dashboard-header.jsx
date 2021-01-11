import * as React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Text } from '@deriv/components';
import { PlatformContext, redirectToLogin, redirectToSignUp, routes } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import DerivLogo from 'Assets/SvgComponents/header/deriv-logo.svg';
import DerivText from 'Assets/SvgComponents/header/deriv-text.svg';
import DerivLogoLight from 'Assets/SvgComponents/header/deriv-logo-light.svg';
import HeaderItemsLoader from '../../../Components/Layout/Header/Components/Preloader/header-items.jsx';

const LoggedInHeader = () => {
    const history = useHistory();

    return (
        <header className='logged-in-dashboard-header'>
            <div className='logged-in-dashboard-header--left'>
                <div onClick={() => history.push(routes.dashboard)}>
                    <DerivLogoLight />
                </div>
            </div>
            <div className='logged-in-dashboard-header--right'>
                <Icon icon={'IcProfile'} size={32} className='logged-in-dashboard-header--right-icon' />
                <Icon icon={'IcNotification'} size={32} />
            </div>
        </header>
    );
};

const LoggedOutHeader = () => {
    const history = useHistory();
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    return (
        <header className='logged-out-dashboard-header'>
            <div className='logged-out-dashboard-header--left'>
                <div onClick={() => history.push(routes.dashboard)}>
                    <DerivLogo style={{ marginRight: '0.684rem' }} />
                    <DerivText />
                </div>
            </div>
            <div className='logged-out-dashboard-header--middle'>
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
            <div className='logged-out-dashboard-header--right'>
                <Button.Group>
                    <Button
                        alternate
                        has_effect
                        text={localize('Log in')}
                        onClick={() => redirectToLogin(false, getLanguage())}
                    />
                    <Button
                        primary
                        text={localize('Create free demo account')}
                        onClick={() => redirectToSignUp({ is_deriv_crypto })}
                    />
                </Button.Group>
            </div>
        </header>
    );
};

const HeaderPreloader = () => (
    <div className={'header-items__preloader'}>
        <HeaderItemsLoader speed={3} />
    </div>
);

const DashboardHeader = ({ is_logged_in, is_logging_in }) => {
    if (is_logging_in) {
        return <HeaderPreloader />;
    }

    if (is_logged_in) {
        return <LoggedInHeader />;
    }

    return <LoggedOutHeader />;
};

DashboardHeader.propTypes = {
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
};

export default connect(({ client }) => ({
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
}))(DashboardHeader);
