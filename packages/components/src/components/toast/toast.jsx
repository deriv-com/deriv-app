import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

const Toast = ({ children, className, is_open = true, onClose, onClick, type = 'info', timeout = 0 }) => {
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
                onMouseDown={e => {
                    // To prevent clickoutside for modal
                    e.nativeEvent.preventDefault();
                    e.nativeEvent.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
            >
                <div className='dc-toast__message' onClick={onClick}>
                    <div className='dc-toast__message-content'>{children}</div>
                </div>
            </div>
        </CSSTransition>
    );
};

Toast.propTypes = {
    className: PropTypes.string,
    is_open: PropTypes.bool,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    type: PropTypes.oneOf(['error', 'info']),
    timeout: PropTypes.number,
};

export default Toast;
