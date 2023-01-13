import React from 'react';
import ReactDOM from 'react-dom';
import { Toast } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/root-store';
import { connect } from 'Stores/connect';

type TBotNotification = {
    show_toast: boolean;
    setShowToast: (show_toast: boolean) => void;
    toast_message: string;
};

const BotNotification = ({ show_toast, toast_message, setShowToast }: TBotNotification) => {
    React.useEffect(() => {
        setTimeout(() => {
            setShowToast(false);
        }, 5000);
    }, [show_toast]);
    const el_portal = document.getElementById('popup_root');

    if (el_portal) {
        return ReactDOM.createPortal(
            <div className='import-notification'>
                {show_toast && (
                    <div>
                        <Toast>
                            {toast_message === 'delete'
                                ? localize('You’ve successfully deleted a bot.')
                                : localize('You’ve successfully imported a bot.')}
                        </Toast>
                    </div>
                )}
            </div>,
            el_portal
        );
    }
    return null;
};

export default connect(({ dashboard }: RootStore) => ({
    show_toast: dashboard.show_toast,
    setShowToast: dashboard.setShowToast,
    toast_message: dashboard.toast_message,
}))(BotNotification);
