import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon/icon';
import Button from '../button/button';
import Text from '../text';
import { useOnClickOutside } from '../../hooks';

type TDialog = {
    cancel_button_text?: string;
    className?: string;
    confirm_button_text?: string;
    dismissable?: boolean;
    disableApp?: () => void;
    enableApp?: () => void;
    has_close_icon?: boolean;
    is_closed_on_cancel?: boolean;
    is_closed_on_confirm?: boolean;
    is_content_centered?: boolean;
    is_loading?: boolean;
    is_mobile_full_width?: boolean;
    is_visible: boolean;
    onCancel?: () => void;
    onClose?: () => void;
    onConfirm: () => void;
    onEscapeButtonCancel?: () => void;
    portal_element_id?: string;
    title?: React.ReactNode;
};

const Dialog = ({
    disableApp,
    dismissable,
    enableApp,
    is_closed_on_cancel = true,
    is_closed_on_confirm = true,
    is_visible,
    onCancel,
    onClose,
    onConfirm,
    onEscapeButtonCancel,
    ...other_props
}: React.PropsWithChildren<TDialog>) => {
    const {
        cancel_button_text,
        className,
        children,
        confirm_button_text,
        is_loading,
        is_mobile_full_width = true,
        is_content_centered,
        portal_element_id,
        title,
        has_close_icon,
    } = other_props;

    const wrapper_ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;

    React.useEffect(() => {
        if (is_visible && !!disableApp) {
            disableApp();
        }
    }, [is_visible, disableApp]);

    React.useEffect(() => {
        const close = (e: { key: string }) => {
            if (e.key === 'Escape') {
                onEscapeButtonCancel?.();
            }
        };
        window.addEventListener('keydown', close);
        return () => window.removeEventListener('keydown', close);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = () => {
        if (is_closed_on_cancel && enableApp) {
            enableApp();
        }
        onCancel?.();
    };

    const handleConfirm = () => {
        if (is_closed_on_confirm && enableApp) {
            enableApp();
        }
        onConfirm();
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else if (onCancel) {
            handleCancel();
        } else {
            handleConfirm();
        }
    };

    const validateClickOutside = () => !!dismissable || !!(has_close_icon && is_visible && is_closed_on_cancel);

    useOnClickOutside(wrapper_ref, handleClose, validateClickOutside);

    const content_classes = classNames('dc-dialog__content', {
        'dc-dialog__content--centered': is_content_centered,
    });
    //
    const is_text =
        typeof children === 'string' ||
        (React.isValidElement(children) && typeof children?.props?.i18n_default_text === 'string');
    const dialog = (
        <CSSTransition
            appear
            in={is_visible && !is_loading}
            timeout={50}
            classNames={{
                appear: 'dc-dialog__wrapper--enter',
                enter: 'dc-dialog__wrapper--enter',
                enterDone: 'dc-dialog__wrapper--enter-done',
                exit: 'dc-dialog__wrapper--exit',
            }}
            unmountOnExit
        >
            <div
                className={classNames('dc-dialog__wrapper', className, {
                    'dc-dialog__wrapper--has-portal': !!portal_element_id,
                })}
            >
                <div
                    className={classNames('dc-dialog__dialog', {
                        'dc-dialog__dialog--has-margin': !is_mobile_full_width,
                    })}
                    role='dialog'
                    ref={wrapper_ref}
                >
                    {(title || has_close_icon) && (
                        <div
                            className={classNames('dc-dialog__header-wrapper', {
                                'dc-dialog__header-wrapper--end': !title,
                            })}
                        >
                            {!!title && (
                                <Text as='h1' color='prominent' weight='bold' className='dc-dialog__header--title'>
                                    {title}
                                </Text>
                            )}
                            {has_close_icon && (
                                <div onClick={handleClose} className='dc-dialog__header--close'>
                                    <Icon icon='IcCross' />
                                </div>
                            )}
                        </div>
                    )}
                    {is_text ? (
                        <Text as='p' size='xs' styles={{ lineHeight: '1.43' }} className={content_classes}>
                            {children}
                        </Text>
                    ) : (
                        <div className={content_classes}>{children}</div>
                    )}
                    <div className='dc-dialog__footer'>
                        {!!onCancel && (
                            <Button
                                className='dc-dialog__button'
                                has_effect
                                text={cancel_button_text}
                                onClick={handleCancel}
                                secondary
                                large
                            />
                        )}
                        {!!confirm_button_text && (
                            <Button
                                className='dc-dialog__button'
                                has_effect
                                text={confirm_button_text}
                                onClick={handleConfirm}
                                primary
                                large
                            />
                        )}
                    </div>
                </div>
            </div>
        </CSSTransition>
    );

    if (portal_element_id) {
        const target_element = document.getElementById(portal_element_id);
        if (target_element) return ReactDOM.createPortal(dialog, target_element);
    }

    return dialog;
};

export default Dialog;
