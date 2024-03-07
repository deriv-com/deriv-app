import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';
import { notification_style, TAction, TNotificationContent, TNotificationStyle } from './bot-notification-utils';

export const NotificationContent: React.FC<TNotificationContent> = ({ message, primary_action }) => {
    return (
        <div className='notification-content'>
            <div>{message}</div>
            {primary_action && <button onClick={primary_action.onClick}>{primary_action.label}</button>}
        </div>
    );
};

export const botNotification = (message: string, primary_action?: TAction, custom_style?: TNotificationStyle) => {
    return toast(<NotificationContent message={message} primary_action={primary_action} />, {
        type: custom_style?.type ?? notification_style.type,
        position: custom_style?.position ?? notification_style.position,
        autoClose: custom_style?.autoClose ?? notification_style.autoClose,
        hideProgressBar: custom_style?.hideProgressBar ?? notification_style.hideProgressBar,
        closeOnClick: custom_style?.closeOnClick ?? notification_style.closeOnClick,
        pauseOnHover: custom_style?.pauseOnHover ?? notification_style.pauseOnHover,
        pauseOnFocusLoss: custom_style?.pauseOnFocusLoss ?? notification_style.pauseOnFocusLoss,
    });
};
