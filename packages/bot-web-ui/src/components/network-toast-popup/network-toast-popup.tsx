import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { MobileWrapper, Toast } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react';

// TODO: Need to sanitize,
// Same sort of component is being used inside DTrader,
// In Future we might move the `NetworkStatusToastError` to the core packages for resuability.

/**
 * Network status Toast components
 */
type TNetworkStatusToastError = {
    status: string;
    portal_id: string;
    message: string;
};

const NetworkStatusToastError = observer(({ status, portal_id, message }: TNetworkStatusToastError) => {
    const { common } = useStore();
    const { network_status } = common;
    const [is_open, setIsOpen] = React.useState(false);

    if (!document.getElementById(portal_id) || !message) return null;

    if (!is_open && status !== 'online') {
        setIsOpen(true); // open if status === 'blinker' or 'offline'
    } else if (is_open && status === 'online') {
        setTimeout(() => {
            setIsOpen(false);
        }, 1500);
    }

    if (network_status) {
        return (
            <NetworkStatusToastError
                portal_id='popup_root'
                message={network_status.tooltip}
                status={network_status.class}
            />
        );
    }

    return ReactDOM.createPortal(
        <MobileWrapper>
            <Toast
                className={classNames({
                    'dc-toast--blinker': status === 'blinker',
                })}
                is_open={is_open}
                timeout={0}
                type='error'
            >
                {message}
            </Toast>
        </MobileWrapper>,
        document.getElementById(portal_id)
    );
});

export default NetworkStatusToastError;
