import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getCurrentProductionDomain } from '@deriv/shared';

const RedirectNoticeModal = ({ is_logged_in, is_eu }) => {
    const [dialog_status, setDialogStatus] = React.useState(false);
    const [external_link, setExternalLink] = React.useState('');

    const isThirdPartyLink = href => {
        let destination;
        try {
            destination = new URL(href);
        } catch (e) {
            return false;
        }
        return (
            !!destination.host &&
            !new RegExp(`^.*\\.${getCurrentProductionDomain() || 'binary\\.com'}$`).test(destination.host) && // destination host is not binary subdomain
            !new RegExp('^.*\\.binary\\.bot$').test(destination.host) && // destination host is not binary subdomain
            !/www.(betonmarkets|xodds).com/.test(destination.host) && // destination host is not binary old domain
            !/deriv.(app|com)/.test(destination.host) && // destination host is not deriv
            window.location.host !== destination.host
        );
    };
    const onCancelDialog = () => {
        setDialogStatus(false);
    };
    const onConfirmDialog = () => {
        setDialogStatus(false);
        window.open(external_link);
    };

    const onClickExternalLink = React.useCallback(
        e => {
            if (isThirdPartyLink(e.target.href) && is_logged_in && is_eu) {
                setExternalLink(e.target.href);
                e.preventDefault();
                setDialogStatus(true);
            }
        },
        [is_logged_in, is_eu]
    );

    React.useEffect(() => {
        document.addEventListener('click', onClickExternalLink);
    }, [onClickExternalLink]);

    React.useEffect(() => {
        return () => {
            document.removeEventListener('click', onClickExternalLink);
        };
    }, [onClickExternalLink]);

    return (
        dialog_status && (
            <Dialog
                className='redirect-notice'
                is_visible={dialog_status}
                title='Redirect notice'
                is_open={dialog_status}
                cancel_button_text={localize('Cancel')}
                confirm_button_text={localize('Proceed')}
                onCancel={onCancelDialog}
                onConfirm={onConfirmDialog}
            >
                {localize('You are being redirected to an external website.')}
            </Dialog>
        )
    );
};

export default RedirectNoticeModal;
