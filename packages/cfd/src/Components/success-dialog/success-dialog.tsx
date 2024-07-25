import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { TSuccessDialogProps } from 'Components/props.types';

const SuccessDialog = ({
    classNameMessage = '',
    has_cancel = false,
    has_submit = true,
    icon,
    message,
    onCancel,
    onSubmit,
    heading,
    icon_size = 'large',
    text_submit,
    text_cancel,
    is_open,
    toggleModal,
    title,
    has_close_icon,
    width = '',
    is_medium_button,
}: TSuccessDialogProps) => {
    return (
        <Modal
            className='cfd-success-dialog'
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
                    data-testid={`dt_cfd_success_modal_icon_wrapper`}
                >
                    {icon}
                    <Icon
                        className='bottom-right-overlay'
                        icon='IcCheckmarkCircle'
                        custom_color='var(--status-success)'
                        size={24}
                    />
                </div>
                {!heading && (
                    <Text as='h2' weight='bold' size='s' className='dc-modal-header__title'>
                        <Localize i18n_default_text='Success!' />
                    </Text>
                )}
                {heading && heading}
                {React.isValidElement(message) && message}
                {!React.isValidElement(message) && <p className={classNameMessage}>{message}</p>}
            </Modal.Body>
            <Modal.Footer>
                {has_cancel && onCancel && (
                    <Button
                        onClick={onCancel}
                        has_effect
                        text={text_cancel || localize('Maybe later')}
                        secondary
                        {...(is_medium_button ? { medium: true } : { large: true })}
                    />
                )}
                {has_submit && onSubmit && (
                    <Button
                        has_effect
                        onClick={onSubmit}
                        text={text_submit}
                        primary
                        {...(is_medium_button ? { medium: true } : { large: true })}
                    />
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default SuccessDialog;
