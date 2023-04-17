import React from 'react';
import ReactDOM from 'react-dom';
import { Div100vhContainer, Toast } from '@deriv/components';
import 'Sass/app/_common/components/app-toast-message.scss';
import { observer, useStore } from '@deriv/stores';

const AppToastMessages = observer(() => {
    const { ui } = useStore();
    const { toasts, removeToast } = ui;
    if (toasts.length === 0) return null;

    const top_toasts = toasts.filter(t => !t.is_bottom);
    const bottom_toasts = toasts.filter(t => t.is_bottom);

    const createToast = toast_config => {
        const { key, content, ...config } = toast_config;
        return (
            <Toast key={key} {...config} onClose={() => removeToast(key)}>
                {content}
            </Toast>
        );
    };

    const toast_messages = (
        <Div100vhContainer className='toast-messages' height_offset='15px'>
            <div className='toast-messages__top'>{top_toasts.map(createToast)}</div>
            <div className='toast-messages__bottom'>{bottom_toasts.map(createToast)}</div>
        </Div100vhContainer>
    );

    return ReactDOM.createPortal(toast_messages, document.getElementById('popup_root'));
});

export default AppToastMessages;
