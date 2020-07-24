import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'Stores/connect';
import 'Sass/app/_common/components/app-toast-message.scss';

// TODO: Refactor existing ToastError component to this component
const Toast = ({ children, className, is_open = true, onClose, onClick, type, timeout = 0 }) => {
    const [is_visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        setVisible(is_open);

        if (timeout) {
            const timeout_id = setTimeout(() => {
                setVisible(false);
            }, timeout);
            return () => clearTimeout(timeout_id);
        }

        return undefined;
    }, [is_open]);

    return (
        <CSSTransition
            in={is_visible}
            timeout={100}
            unmountOnExit
            onExited={() => {
                if (typeof onClose === 'function') {
                    onClose();
                }
                setVisible(false);
            }}
            classNames={{
                appear: 'dc-toast--enter',
                enter: 'dc-toast--enter',
                enterDone: 'dc-toast--enter-done',
                exit: 'dc-toast--exit',
            }}
        >
            <div
                className={classNames('dc-toast', className, {
                    [`dc-toast__${type}`]: type,
                })}
                onClick={onClick}
            >
                <div className='dc-toast__message'>{children}</div>
            </div>
        </CSSTransition>
    );
};

const AppToastMessages = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    const top_toasts = toasts.filter(t => !t.is_bottom);
    const bottom_toasts = toasts.filter(t => t.is_bottom);

    const toast = toast_config => {
        const { key, content, ...config } = toast_config;
        return (
            <Toast key={key} {...config} onClose={() => removeToast(key)}>
                {content}
            </Toast>
        );
    };

    const toast_messages = (
        <div className='dc-toast-messages'>
            <div className='dc-toast-messages__top'>{top_toasts.map(toast)}</div>
            <div className='dc-toast-messages__bottom'>{bottom_toasts.map(toast)}</div>
        </div>
    );

    return ReactDOM.createPortal(toast_messages, document.getElementById('popup_root'));
};

AppToastMessages.propTypes = {
    toasts: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            timeout: PropTypes.number,
            content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
            type: PropTypes.oneOf(['error', 'info']),
            is_bottom: PropTypes.bool,
        })
    ),
    removeToast: PropTypes.func,
};

export default connect(({ ui }) => ({
    toasts: ui.toasts,
    removeToast: ui.removeToast,
}))(AppToastMessages);
