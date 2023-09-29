import React, { useState } from 'react';
import { Icon, Toast } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TBotSnackbar = {
    className?: string;
    is_open: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    handleClose: () => void;
    type?: 'error' | 'info' | 'notification';
    timeout?: number;
    msg_localize_components?: JSX.Element[];
    message: string;
};

const BotSnackbar = ({
    message,
    msg_localize_components = [],
    timeout = 6000,
    is_open,
    onClick,
    handleClose,
    type,
    className,
}: TBotSnackbar) => {
    const [notification_timer, setNotificationTimer] = useState(timeout);

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
                <div>{message && <Localize i18n_default_text={message} components={msg_localize_components} />}</div>
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
