import { Dialog }      from 'deriv-components';
import PropTypes       from 'prop-types';
import React           from 'react';
import { localize }    from 'deriv-translations';
import { ClientBase }  from '_common/base/client_base';
import {
    redirectToLogin,
    redirectToSignUp } from '_common/base/login';

const AuthorizationRequiredModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
}) => (
    <Dialog
        cancel_button_text={localize('Log in')}
        confirm_button_text={localize('Create free account')}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
        is_visible={is_visible}
        onCancel={() => redirectToLogin(ClientBase.isLoggedIn())}
        onConfirm={redirectToSignUp}
        title={localize('Get started for free and without any risk')}
    >
        {localize('Log in or create a free account to start trading')}
    </Dialog>
);

AuthorizationRequiredModal.propTypes = {
    disableApp    : PropTypes.func,
    enableApp     : PropTypes.func,
    is_loading    : PropTypes.bool,
    is_visible    : PropTypes.bool,
    services_error: PropTypes.object,
};

export default AuthorizationRequiredModal;
