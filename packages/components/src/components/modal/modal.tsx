import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Body from './modal-body';
import Footer from './modal-footer';
import Text from '../text/text';
import Icon from '../icon/icon';
import { useOnClickOutside, IClickEvent } from '../../hooks';

type TModalElement = {
    className?: string;
    close_icon_color?: string;
    elements_to_ignore?: HTMLElement[];
    has_close_icon?: boolean;
    header?: React.ReactNode;
    header_background_color?: string;
    height?: string;
    id?: string;
    is_confirmation_modal?: boolean;
    is_open: boolean;
    is_risk_warning_visible?: boolean;
    is_title_centered?: boolean;
    is_vertical_bottom?: boolean;
    is_vertical_centered?: boolean;
    is_vertical_top?: boolean;
    onMount?: () => void;
    onUnmount?: () => void;
    portalId?: string;
    renderTitle?: () => React.ReactNode;
    should_header_stick_body?: boolean;
    small?: boolean;
    title?: string | React.ReactNode;
    toggleModal?: (e?: React.MouseEvent<HTMLElement>) => void;
    width?: string;
};

const ModalElement = ({
    children,
    className,
    close_icon_color,
    elements_to_ignore,
    has_close_icon = true,
    header,
    header_background_color,
    height,
    id,
    is_confirmation_modal,
    is_open,
    is_risk_warning_visible,
    is_title_centered,
    is_vertical_bottom,
    is_vertical_centered,
    is_vertical_top,
    onMount,
    onUnmount,
    portalId,
    renderTitle,
    should_header_stick_body = true,
    small,
    title,
    toggleModal,
    width,
}: React.PropsWithChildren<TModalElement>) => {
    const el_ref = React.useRef(document.createElement('div'));
    const el_portal_node = portalId && document.getElementById(portalId);
    const modal_root_ref = React.useRef(el_portal_node || document.getElementById('modal_root'));
    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    const portal_elements_selector = [
        '.dc-datepicker__picker',
        '.dc-mobile-dialog',
        '.dc-dropdown-list',
        '.dc-dropdown__list',
    ];

    const isPortalElementVisible = () =>
        modal_root_ref.current?.querySelectorAll(portal_elements_selector.join(', ')).length;

    const validateClickOutside = (e: IClickEvent): boolean => {
        const is_absolute_modal_visible = document.getElementById('modal_root_absolute')?.hasChildNodes();
        const path = e.path ?? e.composedPath?.();
        return (
            has_close_icon &&
            !isPortalElementVisible() &&
            is_open &&
            !is_absolute_modal_visible &&
            !(elements_to_ignore && path?.find(el => elements_to_ignore.includes(el as HTMLElement)))
        );
    };

    const closeModal = () => {
        if (is_open) toggleModal?.();
    };

    useOnClickOutside(wrapper_ref, closeModal, validateClickOutside);

    React.useEffect(() => {
        const local_el_ref = el_ref;
        const local_modal_root_ref = modal_root_ref;

        local_el_ref.current.classList.add('dc-modal');
        local_modal_root_ref?.current?.appendChild?.(local_el_ref.current);
        onMount?.();

        return () => {
            local_modal_root_ref?.current?.removeChild?.(local_el_ref.current);
            onUnmount?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const closeOnEscButton = React.useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                toggleModal?.();
            }
        },
        [toggleModal]
    );
    React.useEffect(() => {
        window.addEventListener('keydown', closeOnEscButton);
        return () => window.removeEventListener('keydown', closeOnEscButton);
    }, [closeOnEscButton]);

    const rendered_title = renderTitle ? renderTitle() : null;

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
                        background: header_background_color,
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

type TModal = TModalElement & {
    exit_classname?: string;
    onEntered?: () => void;
    onExited?: () => void;
};

const Modal = ({
    children,
    className,
    close_icon_color,
    elements_to_ignore,
    exit_classname,
    has_close_icon = true,
    header,
    header_background_color,
    height,
    id,
    is_confirmation_modal,
    is_open,
    is_risk_warning_visible,
    is_title_centered,
    is_vertical_bottom,
    is_vertical_centered,
    is_vertical_top,
    onEntered,
    onExited,
    onMount,
    onUnmount,
    portalId,
    renderTitle,
    should_header_stick_body = true,
    small,
    title,
    toggleModal,
    width,
}: React.PropsWithChildren<TModal>) => (
    <CSSTransition
        appear
        in={is_open}
        timeout={250}
        classNames={{
            appear: 'dc-modal__container--enter',
            enter: 'dc-modal__container--enter',
            enterDone: 'dc-modal__container--enter-done',
            exit: exit_classname || 'dc-modal__container--exit',
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
            header_background_color={header_background_color}
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

export default Modal;
