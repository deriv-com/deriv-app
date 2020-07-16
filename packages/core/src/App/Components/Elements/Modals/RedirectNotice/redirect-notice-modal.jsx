import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';

const RedirectNoticeModal = () => {
    const [dialog_status, setDialogStatus] = React.useState(false);
    const [external_link, setExternalLink] = React.useState('');
    function extractHostname(url) {
        const hostname = url.indexOf('//') > -1 ? url.split('/')[2] : url.split('/')[0];
        return hostname.split(':')[0].split('?')[0];
    }
    const onCancelDialog = () => {
        setDialogStatus(false);
    };
    const onConfirmDialog = () => {
        setDialogStatus(false);
        window.open(external_link);
    };

    React.useEffect(() => {
        document.addEventListener('click', function(e) {
            if (e.target.href && e.view.location.host !== extractHostname(e.target.href)) {
                setExternalLink(e.target.href);
                e.preventDefault();
                setDialogStatus(true);
            }
        });
    }, []);

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
