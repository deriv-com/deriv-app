import React from 'react';
import ReactDOM from 'react-dom';
import { Toast } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const StrategyNotification = observer(() => {
    const { dashboard } = useDBotStore();
    const { show_toast, toast_message, setOpenSettings } = dashboard;

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
});

export default StrategyNotification;
