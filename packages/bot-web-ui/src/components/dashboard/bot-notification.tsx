import React from 'react';
import ReactDOM from 'react-dom';
import { Toast } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';

type TBotNotification = {
    show_toast: boolean;
    toast_message: string;
    setOpenSettings: (toast_message: string, show_toast: boolean) => void;
};

const BotNotification = ({ show_toast, toast_message, setOpenSettings }: TBotNotification) => {
    React.useEffect(() => {
        setTimeout(() => {
            setOpenSettings(toast_message, false);
        }, 3000);
    }, [show_toast]);
    const el_portal = document.getElementById('popup_root');

    if (el_portal && show_toast) {
        return ReactDOM.createPortal(
            <div className='import-notification'>
                <div>
                    <Toast>
                        {toast_message === 'delete'
                            ? localize('You’ve successfully deleted a bot.')
                            : localize('You’ve successfully imported a bot.')}
                    </Toast>
                </div>
            </div>,
            el_portal
        );
    }
    return null;
};

export default connect(({ dashboard }: RootStore) => ({
    show_toast: dashboard.show_toast,
    toast_message: dashboard.toast_message,
    setOpenSettings: dashboard.setOpenSettings,
}))(BotNotification);
