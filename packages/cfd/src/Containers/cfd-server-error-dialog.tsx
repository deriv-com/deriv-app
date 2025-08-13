import React from 'react';
import { Dialog, UnhandledErrorModal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { routes } from '@deriv/shared';
import { useHistory } from 'react-router';

const CFDServerErrorDialog = observer(() => {
    const { ui } = useStore();
    const { enableApp, disableApp } = ui;
    const { clearCFDError, error_message, error_type, error_details, has_cfd_error, is_cfd_success_dialog_enabled } =
        useCfdStore();
    const history = useHistory();
    const should_show_error =
        has_cfd_error &&
        !is_cfd_success_dialog_enabled &&
        error_type &&
        error_type !== 'PasswordReset' &&
        error_type !== 'PasswordError' &&
        error_type !== 'IncorrectMT5PasswordFormat' &&
        error_type !== 'InvalidTradingPlatformPasswordFormat';

    const show_update_pob = error_details?.missing?.includes('place_of_birth');

    const goToHome = () => {
        clearCFDError();
    };

    const getRedirection = () => {
        clearCFDError();
        history.push(routes.personal_details);
    };

    if (
        should_show_error &&
        (error_type === 'ASK_FIX_DETAILS' || error_type === 'InsufficientAccountDetails') &&
        show_update_pob
    ) {
        return (
            <Dialog
                title={localize('Add your place of birth')}
                confirm_button_text={localize('Add now')}
                cancel_button_text={localize('Go to Home')}
                onCancel={goToHome}
                onConfirm={getRedirection}
                disableApp={disableApp}
                enableApp={enableApp}
                has_close_icon
                is_visible={should_show_error}
            >
                {localize(`You're missing this detail in your profile. Add it now to continue.`)}
            </Dialog>
        );
    }

    if (should_show_error && error_type === 'ASK_FIX_DETAILS') {
        return (
            <Dialog
                title={localize('Complete your profile')}
                confirm_button_text={localize('Update profile')}
                onConfirm={getRedirection}
                disableApp={disableApp}
                enableApp={enableApp}
                is_visible={should_show_error}
            >
                {localize('To continue, provide the required information in the Personal details section.')}
            </Dialog>
        );
    }
    if (should_show_error) {
        return error_message ? (
            <Dialog
                title={localize('Something’s not right')}
                confirm_button_text={localize('OK')}
                onConfirm={clearCFDError}
                disableApp={disableApp}
                enableApp={enableApp}
                is_visible={should_show_error}
            >
                {error_message}
            </Dialog>
        ) : (
            <UnhandledErrorModal />
        );
    }
    return null;
});

export default CFDServerErrorDialog;
