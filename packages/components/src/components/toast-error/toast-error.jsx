import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

const ToastError = ({ children, className, is_open = true, onClose, onClick, timeout = 0 }) => {
    const [is_visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        setVisible(is_open);

        if (timeout) {
            const timeout_id = setTimeout(() => setVisible(false), timeout);
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
                appear: 'dc-toast-error--enter',
                enter: 'dc-toast-error--enter',
                enterDone: 'dc-toast-error--enter-done',
                exit: 'dc-toast-error--exit',
            }}
        >
            <div className={classNames('dc-toast-error', className)} onClick={onClick}>
                <div className='dc-toast-error__message'>{children}</div>
            </div>
        </CSSTransition>
    );
};

ToastError.propTypes = {
    className: PropTypes.string,
    is_open: PropTypes.bool,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    timeout: PropTypes.number,
};

export default ToastError;
