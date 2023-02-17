import React from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'Stores/connect';
import { Dialog, Text } from '@deriv/components';
import { Localize, getLanguage } from '@deriv/translations';
import { redirectToLogin } from '@deriv/shared';

const ModalHeader = ({ header }) => {
    switch (header) {
        case 'password_changed':
            return (
                <Text as='p' weight='bold' className='reset-password__heading'>
                    <Localize i18n_default_text='Your password has been changed' />
                </Text>
            );
        default:
            return '';
    }
};

const RedirectToLoginModal = ({ is_logged_in, logout, disableApp, enableApp, is_loading }) => {
    const [is_visible, setVisible] = React.useState(false);
    const url_params = new URLSearchParams(useLocation().search);
    const header = url_params.get('header');

    const showModal = () => {
        setVisible(true);
        if (window.localStorage.getItem('is_redirecting') !== 'true') {
            redirectToLogin(false, getLanguage(), false, 3000);
        }
    };

    React.useEffect(() => {
        console.log('logout()', 'redirect-to-login')
        if (is_logged_in) {
            logout().then(() => showModal());
        } else {
            showModal();
        }
    }, [is_logged_in, logout]);

    return (
        <Dialog is_visible={is_visible} disableApp={disableApp} enableApp={enableApp} is_loading={is_loading}>
            <div className='reset-password__password-selection'>
                <ModalHeader header={header} />
                <Text align='center' as='p' size='xxs' className='reset-password__subtext'>
                    <Localize i18n_default_text='We will now redirect you to the login page.' />
                </Text>
            </div>
        </Dialog>
    );
};

export default connect(({ client, ui }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_logged_in: client.is_logged_in,
    logout: client.logout,
}))(RedirectToLoginModal);
