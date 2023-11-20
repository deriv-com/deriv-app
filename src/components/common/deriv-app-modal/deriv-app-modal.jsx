import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './deriv-app-modal.scss';

const base_class = 'deriv-app-modal';

const Modal = ({
    children,
    title,
    onClose,
    action,
    class_name,
    close_on_outside_click = true,
    primary_button,
    secondary_button,
}) => {
    const modal_container_ref = React.useRef();

    React.useEffect(() => {
        function handleModalClickOutside(event) {
            if (modal_container_ref.current && !modal_container_ref.current?.contains(event.target)) {
                onClose();
            }
        }
        if (close_on_outside_click) {
            window.addEventListener('click', handleModalClickOutside);
        }

        return () => {
            if (close_on_outside_click) {
                window.removeEventListener('click', handleModalClickOutside);
            }
        };
    }, []);

    return (
        <div className={classNames(base_class, class_name && `${base_class}-${class_name}`)}>
            <div className={`${base_class}__container`} ref={modal_container_ref}>
                <div className={`${base_class}__header`}>
                    <div className={`${base_class}__header-title`}>{title}</div>
                    <div className={`${base_class}__header-right`}>
                        <div className={`${base_class}__header-right-action`}>{action}</div>
                        <button className={`${base_class}__header-right-close`} onClick={onClose} />
                    </div>
                </div>

                <div className={`${base_class}__content`}>{children}</div>
                {(primary_button || secondary_button) && (
                    <div className={`${base_class}__footer`}>
                        <div className={`${base_class}__footer__btn-container`}>
                            {secondary_button && (
                                <button
                                    className={`${base_class}__footer-secondary-btn`}
                                    onClick={secondary_button.onClick}
                                >
                                    {secondary_button.title}
                                </button>
                            )}
                            {primary_button && (
                                <button
                                    className={`${base_class}__footer-primary-btn`}
                                    onClick={primary_button.onClick}
                                >
                                    {primary_button.title}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

Modal.propTypes = {
    action: PropTypes.any,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    class_name: PropTypes.string,
    onClose: PropTypes.func,
    title: PropTypes.string,
    close_on_outside_click: PropTypes.bool,
    primary_button: PropTypes.shape({
        onClick: PropTypes.func,
        title: PropTypes.string,
    }),
    secondary_button: PropTypes.shape({
        onClick: PropTypes.func,
        title: PropTypes.string,
    }),
};

export default Modal;
