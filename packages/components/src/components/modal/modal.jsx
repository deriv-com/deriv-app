import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Body from './modal-body.jsx';
import Footer from './modal-footer.jsx';
import Icon from '../icon/icon.jsx';
import { useOnClickOutside } from '../../hooks';

const ModalElement = ({
    elements_to_ignore,
    has_close_icon,
    onMount,
    onUnmount,
    is_open,
    toggleModal,
    id,
    title,
    className,
    is_confirmation_modal,
    is_vertical_centered,
    is_vertical_bottom,
    is_vertical_top,
    is_title_centered,
    header,
    portalId,
    children,
    height,
    width,
    renderTitle,
    small,
}) => {
    const el_ref = React.useRef(document.createElement('div'));
    const el_portal_node = document.getElementById(portalId);
    const modal_root_ref = React.useRef(el_portal_node || document.getElementById('modal_root'));
    const wrapper_ref = React.useRef();

    const is_datepicker_visible = () => modal_root_ref.current.querySelectorAll('.dc-datepicker__picker').length;
    const is_dialog_visible = () => modal_root_ref.current.querySelectorAll('.dc-mobile-dialog').length;

    const validateClickOutside = e => {
        const is_absolute_modal_visible = document.getElementById('modal_root_absolute')?.hasChildNodes();
        const path = e.path ?? e.composedPath?.();
        return (
            has_close_icon &&
            !is_datepicker_visible() &&
            !is_dialog_visible() &&
            is_open &&
            !is_absolute_modal_visible &&
            !(elements_to_ignore && path?.find(el => elements_to_ignore.includes(el)))
        );
    };

    const closeModal = () => {
        if (is_open) toggleModal();
    };

    useOnClickOutside(wrapper_ref, closeModal, validateClickOutside);

    React.useEffect(() => {
        el_ref.current.classList.add('dc-modal');
        modal_root_ref.current.appendChild(el_ref.current);
        if (typeof onMount === 'function') onMount();

        return () => {
            modal_root_ref.current.removeChild(el_ref.current);
            if (typeof onUnmount === 'function') onUnmount();
        };
    }, []);

    const rendered_title = typeof renderTitle === 'function' ? renderTitle() : null;

    return ReactDOM.createPortal(
        <div
            ref={wrapper_ref}
            id={id}
            className={classNames('dc-modal__container', {
                [`dc-modal__container_${className}`]: className,
                'dc-modal__container--small': small,
                'dc-modal__container--is-vertical-centered': is_vertical_centered,
                'dc-modal__container--is-vertical-bottom': is_vertical_bottom,
                'dc-modal__container--is-vertical-top': is_vertical_top,
                'dc-modal__container--is-confirmation-modal': is_confirmation_modal,
            })}
            style={{
                height: height || 'auto',
                width: width || 'auto',
            }}
        >
            {(header || title || rendered_title) && (
                <div
                    className={classNames('dc-modal-header', {
                        [`dc-modal-header--${className}`]: className,
                        [`dc-modal-header--is-title-centered`]: is_title_centered,
                    })}
                >
                    {rendered_title && (
                        <h3
                            className={classNames('dc-modal-header__title', {
                                [`dc-modal-header__title--${className}`]: className,
                            })}
                        >
                            {rendered_title}
                        </h3>
                    )}
                    {title && (
                        <h3
                            className={classNames('dc-modal-header__title', {
                                [`dc-modal-header__title--${className}`]: className,
                            })}
                        >
                            {title}
                        </h3>
                    )}
                    {header && (
                        <div
                            className={classNames('dc-modal-header__section', {
                                [`dc-modal-header__section--${className}`]: className,
                            })}
                        >
                            {header}
                        </div>
                    )}
                    {has_close_icon && (
                        <div onClick={toggleModal} className='dc-modal-header__close'>
                            <Icon icon='IcCross' />
                        </div>
                    )}
                </div>
            )}
            {children}
        </div>,
        el_ref.current
    );
};

ModalElement.defaultProps = {
    has_close_icon: true,
};

ModalElement.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    has_close_icon: PropTypes.bool,
    header: PropTypes.node,
    id: PropTypes.string,
    is_open: PropTypes.bool,
    is_title_centered: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    small: PropTypes.bool,
    renderTitle: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),
    toggleModal: PropTypes.func,
    elements_to_ignore: PropTypes.array,
};

const Modal = ({
    children,
    className,
    header,
    id,
    is_open,
    has_close_icon,
    height,
    onEntered,
    onExited,
    onMount,
    onUnmount,
    portalId,
    small,
    is_confirmation_modal,
    is_vertical_bottom,
    is_vertical_centered,
    is_vertical_top,
    is_title_centered,
    renderTitle,
    title,
    toggleModal,
    width,
    elements_to_ignore,
}) => (
    <CSSTransition
        appear
        in={is_open}
        timeout={250}
        classNames={{
            appear: 'dc-modal__container--enter',
            enter: 'dc-modal__container--enter',
            enterDone: 'dc-modal__container--enter-done',
            exit: 'dc-modal__container--exit',
        }}
        unmountOnExit
        onEntered={onEntered}
        onExited={onExited}
    >
        <ModalElement
            className={className}
            header={header}
            id={id}
            is_open={is_open}
            is_confirmation_modal={is_confirmation_modal}
            is_vertical_bottom={is_vertical_bottom}
            is_vertical_centered={is_vertical_centered}
            is_vertical_top={is_vertical_top}
            is_title_centered={is_title_centered}
            title={title}
            toggleModal={toggleModal}
            has_close_icon={has_close_icon}
            height={height}
            onMount={onMount}
            onUnmount={onUnmount}
            portalId={portalId}
            renderTitle={renderTitle}
            small={small}
            width={width}
            elements_to_ignore={elements_to_ignore}
        >
            {children}
        </ModalElement>
    </CSSTransition>
);

Modal.Body = Body;
Modal.Footer = Footer;

Modal.defaultProps = {
    has_close_icon: true,
};

Modal.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    has_close_icon: PropTypes.bool,
    header: PropTypes.node,
    height: PropTypes.string,
    id: PropTypes.string,
    is_open: PropTypes.bool,
    is_confirmation_modal: PropTypes.bool,
    is_vertical_bottom: PropTypes.bool,
    is_vertical_centered: PropTypes.bool,
    is_vertical_top: PropTypes.bool,
    is_title_centered: PropTypes.bool,
    onEntered: PropTypes.func,
    onExited: PropTypes.func,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    portalId: PropTypes.string,
    renderTitle: PropTypes.func,
    small: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),
    toggleModal: PropTypes.func,
    width: PropTypes.string,
    elements_to_ignore: PropTypes.array,
};

export default Modal;
