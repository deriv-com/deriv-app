import React from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getCurrentProductionDomain } from '@deriv/shared';

const RedirectNoticeModal = ({ is_logged_in, is_eu, portal_id }) => {
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
            !/www\.(betonmarkets|xodds)\.com/.test(destination.host) && // destination host is not binary old domain
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

    const onClickExternalLink = e => {
        const link_element = e.target.tagName === 'A' ? e.target : e.target.closest('a');
        if (link_element) {
            if (isThirdPartyLink(link_element.href) && is_logged_in && is_eu) {
                e.preventDefault();
                e.stopPropagation();
                setExternalLink(link_element.href);
                setDialogStatus(true);
            }
        }
    };

    React.useEffect(() => {
        document.addEventListener('click', onClickExternalLink);
        return () => {
            document.removeEventListener('click', onClickExternalLink);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_logged_in, is_eu]);

    return ReactDOM.createPortal(
        <Dialog
            className='redirect-notice'
            is_visible={dialog_status}
            title='Redirect notice'
            cancel_button_text={localize('Cancel')}
            confirm_button_text={localize('Proceed')}
            onCancel={onCancelDialog}
            onConfirm={onConfirmDialog}
            dismissable={onCancelDialog}
        >
            {localize('You are being redirected to an external website.')}
        </Dialog>,
        document.getElementById(portal_id)
    );
};

export default RedirectNoticeModal;
