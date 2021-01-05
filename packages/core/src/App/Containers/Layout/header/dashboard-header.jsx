import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Text } from '@deriv/components';
import { PlatformContext, redirectToLogin, redirectToSignUp, routes } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

const DashboardHeader = () => {
    const history = useHistory();
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    return (
        <header className='dashboard-header'>
            <div className='dashboard-header__menu-items'>
                <div className='dashboard-header__menu-items-left'>
                    <Text color='colored-background' size='m' onClick={() => history.push(routes.dashboard)}>
                        Deriv
                    </Text>
                </div>
                <div className='dashboard-header__menu-items-middle'>
                    <Text color='colored-background' size='s' onClick={() => history.push(routes.explore)}>
                        Explore
                    </Text>
                    <Text color='colored-background' size='s' onClick={() => history.push(routes.about_us)}>
                        About us
                    </Text>
                    <Text color='colored-background' size='s' onClick={() => history.push(routes.resources)}>
                        Resources
                    </Text>
                </div>
                <div className='dashboard-header__menu-items-right'>
                    <Button.Group>
                        <Button tertiary onClick={() => redirectToLogin(false, getLanguage())}>
                            Log in
                        </Button>
                        <Button primary onClick={() => redirectToSignUp({ is_deriv_crypto })}>
                            Create free demo account
                        </Button>
                    </Button.Group>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
