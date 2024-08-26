import { useEffect, useState } from 'react';
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
    const [is_visible, setIsVisible] = useState(false);
    const { isMobile } = useDevice();
    const new_portal_id = document.getElementById(portal_id);

    useEffect(() => {
        if (!new_portal_id || !message || !isMobile) return;
        if (!is_visible && status !== 'online') {
            setIsVisible(true);
        } else if (is_visible && status === 'online') {
            setTimeout(() => {
                setIsVisible(false);
            }, 1500);
        }
    }, [isMobile, is_visible, message, new_portal_id, status]);

    if (!new_portal_id || !message || !isMobile) return null;

    return createPortal(
        <div className='network-status__container'>
            <Snackbar hasCloseButton={false} message={message} isVisible={is_visible} />
        </div>,
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
