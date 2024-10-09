import React from 'react';
import { useLocation } from 'react-router-dom';
import { observer, useStore } from '@deriv/stores';
import { useSnackbar, SnackbarController } from '@deriv-com/quill-ui';
import { isEmptyObject, routes } from '@deriv/shared';

const Snackbar = observer(() => {
    const {
        common: { services_error, resetServicesError },
        ui: { is_mf_verification_pending_modal_visible },
    } = useStore();
    const { addSnackbar } = useSnackbar();
    const { pathname } = useLocation();

    const { code, message, type } = services_error || {};
    const has_services_error = !isEmptyObject(services_error);
    const is_insufficient_balance = code === 'InsufficientBalance' || code === 'InvalidContractProposal';
    const is_authorization_required = code === 'AuthorizationRequired' && type === 'buy';
    const is_account_verification_required = code === 'PleaseAuthenticate';
    // Error modal is shown only for next four types. For the rest - snackbar.
    const is_modal_error =
        is_insufficient_balance ||
        is_authorization_required ||
        is_account_verification_required ||
        is_mf_verification_pending_modal_visible;

    const getShouldShowErrorSnackBar = () => {
        if (!has_services_error) return false;
        if (pathname === routes.trade) return has_services_error && !is_modal_error;
        if (pathname === routes.trader_positions || location.pathname.startsWith('/contract/'))
            return has_services_error;
        return false;
    };
    const should_show_error_snackbar = getShouldShowErrorSnackBar();

    React.useEffect(() => {
        if (should_show_error_snackbar) {
            addSnackbar({
                message,
                status: 'fail',
                standalone: true,
                hasCloseButton: true,
                hasFixedHeight: false,
                onSnackbarRemove: resetServicesError,
                style: { marginBottom: '48px', width: 'calc(100% - var(--core-spacing-800)' },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_show_error_snackbar]);

    return <SnackbarController />;
});

export default Snackbar;
