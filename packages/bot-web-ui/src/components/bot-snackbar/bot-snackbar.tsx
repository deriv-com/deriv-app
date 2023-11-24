import React, { useState } from 'react';
import { Icon, Toast } from '@deriv/components';

type TBotSnackbar = {
    className?: string;
    is_open: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    handleClose: () => void;
    type?: 'error' | 'info' | 'notification';
    timeout?: number;
    message: JSX.Element;
};

const BotSnackbar = ({ message, timeout = 6000, is_open, onClick, handleClose, type, className }: TBotSnackbar) => {
    const [notification_timer, setNotificationTimer] = useState(timeout);

    React.useEffect(() => {
        if (is_open) {
            setNotificationTimer(timeout);
        }
    }, [is_open, timeout]);

    return (
        <div
            onMouseOver={() => {
                setNotificationTimer(0);
            }}
            onMouseLeave={() => {
                setNotificationTimer(timeout);
            }}
            className={className ?? 'bot-snackbar'}
            data-testid='bot-snackbar-notification-container'
        >
            <Toast is_open={is_open} type={type} timeout={notification_timer} onClick={onClick} onClose={handleClose}>
                <div>{message}</div>
                <Icon
                    icon='IcCross'
                    className={'notification-close'}
                    data_testid={'bot-snackbar-notification-close'}
                    onClick={handleClose}
                />
            </Toast>
        </div>
    );
};
export default BotSnackbar;
