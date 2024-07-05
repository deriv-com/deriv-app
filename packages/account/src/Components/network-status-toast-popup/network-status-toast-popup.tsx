import { useState } from 'react';
import { createPortal } from 'react-dom';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Snackbar } from '@deriv-com/quill-ui';
import './network-status-toast-popup.scss';

type TNetworkStatusToast = {
    status: string;
    portal_id: string;
    message: string;
};

const NetworkStatusToast = ({ status, portal_id, message }: TNetworkStatusToast) => {
    const [is_open, setIsOpen] = useState(false);
    const { isDesktop } = useDevice();
    const new_portal_id = document.getElementById(portal_id);

    if (!new_portal_id || !message) return null;

    if (!is_open && status !== 'online') {
        setIsOpen(true);
    } else if (is_open && status === 'online') {
        setTimeout(() => {
            setIsOpen(false);
        }, 1500);
    }

    return createPortal(
        !isDesktop && (
            <div className='network-status__container'>
                <Snackbar hasCloseButton={false} message={message} isVisible={is_open} actionText='' />
            </div>
        ),
        new_portal_id
    );
};

const NetworkStatusToastPopup = observer(() => {
    const {
        common: { network_status },
    } = useStore();
    return <NetworkStatusToast portal_id='popup_root' message={network_status.tooltip} status={network_status.class} />;
});

export default NetworkStatusToastPopup;
