import classNames        from 'classnames';
import React             from 'react';
import PropTypes         from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import Button            from '../button/button.jsx';

class Dialog extends React.Component {
    componentDidMount() {
        if (this.props.is_visible) {
            this.props.disableApp();
        }
    }

    componentDidUpdate() {
        if (this.props.is_visible) {
            this.props.disableApp();
        }
    }

    handleCancel = () => {
        if (this.props.is_closed_on_cancel) {
            this.props.enableApp();
        }
        this.props.onCancel();
    };

    handleConfirm = () => {
        if (this.props.is_closed_on_confirm) {
            this.props.enableApp();
        }
        this.props.onConfirm();
    };

    render() {
        const {
            cancel_button_text,
            children,
            confirm_button_text,
            onCancel,
            is_loading,
            is_visible,
            title,
        } = this.props;
        return (
            <React.Fragment>
                <CSSTransition
                    appear
                    in={(is_visible && !is_loading)}
                    timeout={50}
                    classNames={{
                        appear   : 'dc-dialog__wrapper--enter',
                        enter    : 'dc-dialog__wrapper--enter',
                        enterDone: 'dc-dialog__wrapper--enter-done',
                        exit     : 'dc-dialog__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <div className='dc-dialog__wrapper'>
                        <div className='dc-dialog__dialog'>
                            { title &&
                                <h1 className='dc-dialog__header'>{title}</h1>
                            }
                            { typeof children === 'string' ?
                                <p className='dc-dialog__content'>{children}</p>
                                :
                                <div className='dc-dialog__content'>{children}</div>
                            }
                            <div className='dc-dialog__footer'>
                                { onCancel &&
                                    <Button
                                        className={classNames(
                                            'dc-dialog__button',
                                            'btn--secondary',
                                            'btn--secondary--orange',
                                        )}
                                        has_effect
                                        text={cancel_button_text}
                                        onClick={this.handleCancel}
                                    />
                                }
                                { confirm_button_text &&
                                    <Button
                                        className={classNames(
                                            'dc-dialog__button',
                                            'btn--primary',
                                            'btn--primary--default',
                                        )}
                                        has_effect
                                        text={confirm_button_text}
                                        onClick={this.handleConfirm}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </CSSTransition>
            </React.Fragment>
        );
    }
}

Dialog.defaultProps = {
    is_closed_on_cancel : true,
    is_closed_on_confirm: true,
};

Dialog.propTypes = {
    cancel_button_text  : PropTypes.string,
    confirm_button_text : PropTypes.string,
    disableApp          : PropTypes.func,
    enableApp           : PropTypes.func,
    is_closed_on_cancel : PropTypes.bool,
    is_closed_on_confirm: PropTypes.bool,
    is_loading          : PropTypes.bool,
    is_visible          : PropTypes.bool,
    onCancel            : PropTypes.func,
    onConfirm           : PropTypes.func,
    title               : PropTypes.string,
};

export default Dialog;
