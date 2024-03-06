import React, { ReactNode } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { toast, ToastPosition, TypeOptions } from 'react-toastify';
import { Localize } from '@deriv/translations';

type TNotificationStyle = {
    type: TypeOptions;
    position: ToastPosition;
    autoClose: number;
    hideProgressBar: boolean;
    closeOnClick: boolean;
    pauseOnHover: boolean;
};

export enum IMPORT_NOTIFICATION_TYPE {
    BOT_IMPORT = 'BOT_IMPORT',
    BOT_DELETE = 'BOT_DELETE',
}

export const notification_message = {
    bot_stop: (
        <Localize
            i18n_default_text='You’ve just stopped the bot. Any open contracts can be viewed on the <0>Reports</0> page.'
            components={[
                <a
                    key={0}
                    style={{ color: 'var(--general-main-1)' }}
                    rel='noopener noreferrer'
                    target='_blank'
                    href={'/reports'}
                />,
            ]}
        />
    ),
    workspace_change: 'Changes you make will not affect your running bot.',
    [IMPORT_NOTIFICATION_TYPE.BOT_IMPORT]: 'You’ve successfully imported a bot.',
    [IMPORT_NOTIFICATION_TYPE.BOT_DELETE]: 'You’ve successfully deleted a bot.',
};

export const botNotification = (message: ReactNode, custom_style?: TNotificationStyle) => {
    return toast(message, {
        type: custom_style?.type ?? notification_style.type,
        position: custom_style?.position ?? notification_style.position,
        autoClose: custom_style?.autoClose ?? notification_style.autoClose,
        hideProgressBar: custom_style?.hideProgressBar ?? notification_style.hideProgressBar,
        closeOnClick: custom_style?.closeOnClick ?? notification_style.closeOnClick,
        pauseOnHover: custom_style?.pauseOnHover ?? notification_style.pauseOnHover,
    });
};

const notification_style = {
    type: toast.TYPE.DEFAULT,
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 6000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
};
