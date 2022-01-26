import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Body from './modal-body.jsx';
import Footer from './modal-footer.jsx';
import Icon from '../icon/icon.jsx';
import Text from '../text/text.jsx';
import { useOnClickOutside } from '../../hooks';

type ModalProps = {
    children: React.ReactNode;
    className: string;
    close_icon_color: string;
    should_header_stick_body: boolean;
    has_close_icon: boolean;
    header: unknown;
    header_backgound_color: string;
    height: string;
    id: string;
    is_open: boolean;
    is_confirmation_modal: boolean;
    is_vertical_bottom: boolean;
    is_vertical_centered: boolean;
    is_vertical_top: boolean;
    is_title_centered: boolean;
    onEntered: () => void;
    onExited: () => void;
    onMount: () => void;
    onUnmount: () => void;
    portalId: string;
    renderTitle: () => void;
    small: boolean;
    title: unknown | string | boolean;
    toggleModal: () => void;
    width: string;
    elements_to_ignore: unknown;
};

type ModalElementProps = {
    children: React.ReactNode;
    className: string;
    close_icon_color: string;
    has_close_icon: boolean;
    header_backgound_color: string;
    header: unknown;
    id: string;
    is_open: boolean;
    is_title_centered: boolean;
    onMount: () => void;
    onUnmount: () => void;
    small: boolean;
    should_header_stick_body: boolean;
    renderTitle: () => void;
    title: unknown | string | boolean;
    toggleModal: () => void;
    elements_to_ignore: unknown;
};

const ModalElement = ({
    close_icon_color,
    elements_to_ignore,
    has_close_icon,
    onMount,
    onUnmount,
    is_open,
    is_risk_warning_visible,
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
    header_backgound_color,
    portalId,
    children,
    height,
    should_header_stick_body,
    width,
    renderTitle,
    small,
}: ModalElementProps) => {
    const el_ref = React.useRef(document.createElement('div'));
    const el_portal_node = document.getElementById(portalId);
    const modal_root_ref = React.useRef(el_portal_node || document.getElementById('modal_root'));
    const wrapper_ref = React.useRef();

    const portal_elements_selector = [
        '.dc-datepicker__picker',
        '.dc-mobile-dialog',
        '.dc-dropdown-list',
        '.dc-dropdown__list',
    ];

    const isPortalElementVisible = () =>
        modal_root_ref.current.querySelectorAll(portal_elements_selector.join(', ')).length;

    const validateClickOutside = e => {
        const is_absolute_modal_visible = document.getElementById('modal_root_absolute')?.hasChildNodes();
        const path = e.path ?? e.composedPath?.();
        return (
            has_close_icon &&
            !isPortalElementVisible() &&
            is_open &&
            !is_absolute_modal_visible &&
            !(elements_to_ignore && path?.find(el => elements_to_ignore.includes(el)))
        );
    };

    const closeModal = e => {
        if (is_open) toggleModal(e);
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

    React.useEffect(() => {
        const closeOnEscButton = e => {
            if (e.key === 'Escape') {
                toggleModal?.();
            }
        };
        window.addEventListener('keydown', closeOnEscButton);
        return () => window.removeEventListener('keydown', closeOnEscButton);
    }, []);

    const rendered_title = typeof renderTitle === 'function' ? renderTitle() : null;

    return ReactDOM.createPortal(
        <div
            ref={wrapper_ref}
            id={id}
            className={classNames('dc-modal__container', {
                [`dc-modal__container_${className}`]: className,
                'dc-modal__container--risk-message': is_risk_warning_visible,
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
            {!is_risk_warning_visible && (header || title || rendered_title) && (
                <div
                    className={classNames('dc-modal-header', {
                        'dc-modal-header__border-bottom': !should_header_stick_body,
                        [`dc-modal-header--${className}`]: className,
                        [`dc-modal-header--is-title-centered`]: is_title_centered,
                    })}
                    style={{
                        background: header_backgound_color,
                    }}
                >
                    {rendered_title && (
                        <Text
                            as='h3'
                            color='prominent'
                            weight='bold'
                            styles={{ lineHeight: '2.4rem' }}
                            className={classNames('dc-modal-header__title', {
                                [`dc-modal-header__title--${className}`]: className,
                            })}
                        >
                            {rendered_title}
                        </Text>
                    )}
                    {title && (
                        <Text
                            as='h3'
                            color='prominent'
                            weight='bold'
                            styles={{ lineHeight: '2.4rem' }}
                            className={classNames('dc-modal-header__title', {
                                [`dc-modal-header__title--${className}`]: className,
                            })}
                        >
                            {title}
                        </Text>
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
                        <div onClick={toggleModal} className='dc-modal-header__close' role='button'>
                            <Icon icon='IcCross' color={close_icon_color} />
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
    should_header_stick_body: true,
};

const Modal = ({
    children,
    className,
    close_icon_color,
    header,
    id,
    is_open,
    is_risk_warning_visible,
    has_close_icon,
    header_backgound_color,
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
    should_header_stick_body,
    title,
    toggleModal,
    width,
    elements_to_ignore,
}: ModalProps) => (
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
            close_icon_color={close_icon_color}
            should_header_stick_body={should_header_stick_body}
            header={header}
            header_backgound_color={header_backgound_color}
            id={id}
            is_open={is_open}
            is_risk_warning_visible={is_risk_warning_visible}
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
    should_header_stick_body: true,
};

export default Modal;
