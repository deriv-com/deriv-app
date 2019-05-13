import classNames  from 'classnames';
import React       from 'react';
import PropTypes   from 'prop-types';
import posed,
{ PoseGroup }      from 'react-pose';
import Button      from 'App/Components/Form/button.jsx';
import { connect } from 'Stores/connect';

const ModalWrapper = posed.div({
    enter: {
        y         : 0,
        opacity   : 1,
        delay     : 300,
        transition: {
            default: { duration: 250 },
        },
    },
    exit: {
        y         : 50,
        opacity   : 0,
        transition: { duration: 250 },
    },
});

const ModalBackground = posed.div({
    enter: { opacity: 1 },
    exit : { opacity: 0 },
});

class FullPageModal extends React.Component {
    componentDidMount() {
        if (this.props.is_visible) {
            this.props.showAppBlur();
        }
    }

    componentDidUpdate() {
        if (this.props.is_visible) {
            this.props.showAppBlur();
        }
    }

    handleCancel = () => {
        if (this.props.is_closed_on_cancel) {
            this.props.hideAppBlur();
        }
        this.props.onCancel();
    }

    handleConfirm = () => {
        if (this.props.is_closed_on_confirm) {
            this.props.hideAppBlur();
        }
        this.props.onConfirm();
    }

    render() {
        const {
            cancel_button_text,
            children,
            confirm_button_text,
            onCancel,
            is_visible,
            title,
        } = this.props;
        return (
            <PoseGroup>
                {is_visible && [
                    <ModalBackground
                        className='full-page-modal__background'
                        key='full-page-modal__background'
                    />,
                    <ModalWrapper
                        className='full-page-modal__wrapper'
                        key='full-page-modal__wrapper'
                    >
                        <div className='full-page-modal__dialog'>
                            <h1 className='full-page-modal__header'>{title}</h1>
                            <p className='full-page-modal__content'>{children}</p>
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
                            </div>
                        </div>
                    </ModalWrapper>,
                ]}
            </PoseGroup>
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
    hideAppBlur         : PropTypes.func,
    is_closed_on_cancel : PropTypes.bool,
    is_closed_on_confirm: PropTypes.bool,
    is_visible          : PropTypes.bool,
    onCancel            : PropTypes.func,
    onConfirm           : PropTypes.func,
    showAppBlur         : PropTypes.func,
    title               : PropTypes.string,
};

const full_page_modal = connect(
    ({ ui }) => ({
        hideAppBlur: ui.hideAppBlur,
        showAppBlur: ui.showAppBlur,
    }),
)(FullPageModal);
export default full_page_modal;
