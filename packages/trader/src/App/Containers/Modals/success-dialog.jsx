import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { Button, Icon, Modal } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const SuccessDialog = ({
    classNameMessage = undefined,
    has_cancel,
    has_submit,
    icon,
    message,
    onCancel,
    onSubmit,
    heading,
    icon_size,
    text_submit,
    text_cancel,
    is_open,
    toggleModal,
    title,
    has_close_icon,
    width = undefined,
}) => {
    const MainIcon = () => icon || null;

    const Checkmark = ({ className }) => (
        <Icon className={className} icon='IcCheckmarkCircle' custom_color='var(--status-success)' size={24} />
    );

    return (
        <Modal
            className='mt5-success-dialog'
            is_open={is_open}
            toggleModal={toggleModal}
            has_close_icon={has_close_icon}
            small={!title}
            title={title}
            width={width}
        >
            <Modal.Body>
                <div
                    className={classNames('success-change__icon-area', {
                        'success-change__icon-area--large': icon_size === 'large',
                        'success-change__icon-area--xlarge': icon_size === 'xlarge',
                    })}
                >
                    <MainIcon />
                    <Checkmark className='bottom-right-overlay' />
                </div>
                {!heading && (
                    <h2 className='dc-modal-header__title'>
                        <Localize i18n_default_text='Success!' />
                    </h2>
                )}
                {heading && heading}
                {React.isValidElement(message) && message}
                {!React.isValidElement(message) && <p className={classNameMessage}>{message}</p>}
            </Modal.Body>
            <Modal.Footer>
                {has_cancel && (
                    <Button
                        onClick={onCancel}
                        has_effect
                        text={text_cancel || localize('Maybe later')}
                        secondary
                        large
                    />
                )}
                {has_submit && <Button has_effect onClick={onSubmit} text={text_submit} primary large />}
            </Modal.Footer>
        </Modal>
    );
};

SuccessDialog.defaultProps = {
    icon_size: 'large',
    has_cancel: false,
    has_submit: true,
};

SuccessDialog.propTypes = {
    classNameMessage: PropTypes.string,
    has_cancel: PropTypes.bool,
    has_submit: PropTypes.bool,
    heading: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.object,
    icon_size: PropTypes.string,
    icon_type: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    text_submit: PropTypes.string,
};

export default SuccessDialog;
