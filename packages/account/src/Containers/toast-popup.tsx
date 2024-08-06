import clsx from 'clsx';
import React from 'react';
import ReactDOM from 'react-dom';
import { Toast } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

type TNetworkStatusToastError = {
    status: string;
    portal_id: string;
    message: string;
};

/**
 * Network status Toast components
 */
const NetworkStatusToastError = ({ status, portal_id, message }: TNetworkStatusToastError) => {
    const [is_open, setIsOpen] = React.useState(false);
    const { isDesktop } = useDevice();
    const new_portal_id = document.getElementById(portal_id);

    if (!new_portal_id || !message) return null;

    if (!is_open && status !== 'online') {
        setIsOpen(true); // open if status === 'blinker' or 'offline'
    } else if (is_open && status === 'online') {
        setTimeout(() => {
            setIsOpen(false);
        }, 1500);
    }

    return ReactDOM.createPortal(
        !isDesktop && (
            <Toast
                className={clsx({
                    'dc-toast--blinker': status === 'blinker',
                })}
                is_open={is_open}
                timeout={0}
                type='error'
            >
                {message}
            </Toast>
        ),
        new_portal_id
    );
};

export const NetworkStatusToastErrorPopup = observer(() => {
    const {
        common: { network_status },
    } = useStore();
    return (
        <NetworkStatusToastError
            portal_id='popup_root'
            message={network_status.tooltip}
            status={network_status.class}
        />
    );
});
