import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Button from '../button/button.jsx';
import Icon from '../icon/icon.jsx';

class Dialog extends React.Component {
    componentDidMount() {
        if (this.props.is_visible && this.props.disableApp) {
            this.props.disableApp();
        }
    }

    componentDidUpdate() {
        if (this.props.is_visible && this.props.disableApp) {
            this.props.disableApp();
        }
    }

    handleCancel = () => {
        if (this.props.is_closed_on_cancel && this.props.enableApp) {
            this.props.enableApp();
        }
        this.props.onCancel();
    };

    handleConfirm = () => {
        if (this.props.is_closed_on_confirm && this.props.enableApp) {
            this.props.enableApp();
        }
        this.props.onConfirm();
    };

    render() {
        const {
            cancel_button_text,
            className,
            children,
            confirm_button_text,
            onCancel,
            is_loading,
            is_visible,
            is_mobile_full_width = true,
            is_content_centered,
            portal_element_id,
            title,
            has_close_icon,
        } = this.props;

        const content_classes = classNames('dc-dialog__content', {
            'dc-dialog__content--centered': is_content_centered,
        });

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
                    >
                        <div className='dc-dialog__header-wrapper'>
                            {!!title && <h1 className='dc-dialog__header'>{title}</h1>}
                            {has_close_icon && (
                                <div
                                    onClick={onCancel ? this.handleCancel : this.handleConfirm}
                                    className='dc-dialog__header--close'
                                >
                                    <Icon icon='IcCross' />
                                </div>
                            )}
                        </div>
                        {typeof children === 'string' ? (
                            <p className={content_classes}>{children}</p>
                        ) : (
                            <div className={content_classes}>{children}</div>
                        )}
                        <div className='dc-dialog__footer'>
                            {!!onCancel && (
                                <Button
                                    className='dc-dialog__button'
                                    has_effect
                                    text={cancel_button_text}
                                    onClick={this.handleCancel}
                                    secondary
                                    large
                                />
                            )}
                            {!!confirm_button_text && (
                                <Button
                                    className='dc-dialog__button'
                                    has_effect
                                    text={confirm_button_text}
                                    onClick={this.handleConfirm}
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
            return ReactDOM.createPortal(dialog, document.getElementById(portal_element_id));
        }

        return dialog;
    }
}

Dialog.defaultProps = {
    is_closed_on_cancel: true,
    is_closed_on_confirm: true,
};

Dialog.propTypes = {
    cancel_button_text: PropTypes.string,
    confirm_button_text: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_closed_on_cancel: PropTypes.bool,
    is_closed_on_confirm: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    portal_element_id: PropTypes.string,
    title: PropTypes.string,
};

export default Dialog;
