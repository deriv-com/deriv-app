import classNames        from 'classnames';
import React             from 'react';
import PropTypes         from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import Button            from 'deriv-components/lib/button';
import { connect }       from 'Stores/connect';

class FullPageModal extends React.Component {
    componentDidMount() {
        if (this.props.is_visible) {
            this.props.showFullBlur();
        }
    }

    componentDidUpdate() {
        if (this.props.is_visible) {
            this.props.showFullBlur();
        }
    }

    handleCancel = () => {
        if (this.props.is_closed_on_cancel) {
            this.props.hideFullBlur();
        }
        this.props.onCancel();
    };

    handleConfirm = () => {
        if (this.props.is_closed_on_confirm) {
            this.props.hideFullBlur();
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
                        appear   : 'full-page-modal__background--enter',
                        enter    : 'full-page-modal__background--enter',
                        enterDone: 'full-page-modal__background--enter-done',
                        exit     : 'full-page-modal__background--exit',
                    }}
                    unmountOnExit
                >
                    <div className='full-page-modal__background' />
                </CSSTransition>
                <CSSTransition
                    appear
                    in={(is_visible && !is_loading)}
                    timeout={50}
                    classNames={{
                        appear   : 'full-page-modal__wrapper--enter',
                        enter    : 'full-page-modal__wrapper--enter',
                        enterDone: 'full-page-modal__wrapper--enter-done',
                        exit     : 'full-page-modal__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <div className='full-page-modal__wrapper'>
                        <div className='full-page-modal__dialog'>
                            { title &&
                                <h1 className='full-page-modal__header'>{title}</h1>
                            }
                            { typeof children === 'string' ?
                                <p className='full-page-modal__content'>{children}</p>
                                :
                                <div className='full-page-modal__content'>{children}</div>
                            }
                            <div className='full-page-modal__footer'>
                                { onCancel &&
                                    <Button
                                        className={classNames(
                                            'full-page-modal__button',
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
                                            'full-page-modal__button',
                                            'btn--primary',
                                            'btn--primary--orange',
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

FullPageModal.defaultProps = {
    is_closed_on_cancel : true,
    is_closed_on_confirm: true,
};

FullPageModal.propTypes = {
    cancel_button_text  : PropTypes.string,
    confirm_button_text : PropTypes.string,
    hideFullBlur        : PropTypes.func,
    is_closed_on_cancel : PropTypes.bool,
    is_closed_on_confirm: PropTypes.bool,
    is_loading          : PropTypes.bool,
    is_visible          : PropTypes.bool,
    onCancel            : PropTypes.func,
    onConfirm           : PropTypes.func,
    showFullBlur        : PropTypes.func,
    title               : PropTypes.string,
};

const full_page_modal = connect(
    ({ ui }) => ({
        hideFullBlur: ui.hideFullBlur,
        is_loading  : ui.is_loading,
        showFullBlur: ui.showFullBlur,
    }),
)(FullPageModal);
export default full_page_modal;
