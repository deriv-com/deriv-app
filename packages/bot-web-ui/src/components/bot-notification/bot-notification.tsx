import React, { useState } from 'react';
import { Icon, Toast } from '@deriv/components';

type TBotNotification = {
    className?: string;
    is_open: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    handleClose?: () => void;
    type?: 'error' | 'info' | 'notification';
    timeout?: number;
    message: JSX.Element;
};

const BotNotification = ({
    message,
    timeout = 6000,
    is_open,
    onClick,
    handleClose,
    type,
    className,
}: TBotNotification) => {
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
            className={className ?? 'bot-notification'}
            data-testid='bot-notification-container'
        >
            <Toast is_open={is_open} type={type} timeout={notification_timer} onClick={onClick} onClose={handleClose}>
                <div>{message}</div>
                <Icon
                    icon='IcCross'
                    className={'bot-notification__close-icon'}
                    data_testid={'bot-notification-close'}
                    onClick={handleClose}
                />
            </Toast>
        </div>
    );
};
export default BotNotification;
