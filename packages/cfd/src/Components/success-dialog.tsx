import classNames from 'classnames';
import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

type TSuccessDialog = {
    classNameMessage?: string;
    has_cancel?: boolean;
    has_submit?: boolean;
    icon: React.ReactElement;
    message: React.ReactElement | string;
    onCancel?: () => void;
    onSubmit?: () => void;
    heading?: React.ReactElement | string;
    icon_size?: string;
    text_submit?: string;
    text_cancel?: string;
    is_open: boolean;
    toggleModal: () => void;
    title?: string;
    has_close_icon: boolean;
    width: string;
    is_medium_button?: boolean;
};

const Checkmark = ({ className }: { className: string }) => (
    <Icon className={className} icon='IcCheckmarkCircle' custom_color='var(--status-success)' size={24} />
);

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
}: TSuccessDialog) => {
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
                >
                    {icon}
                    <Checkmark className='bottom-right-overlay' />
                </div>
                {!heading ? (
                    <Text as='h2' weight='bold' size='s' className='dc-modal-header__title'>
                        <Localize i18n_default_text='Success!' />
                    </Text>
                ) : (
                    heading
                )}
                {React.isValidElement(message) ? message : <p className={classNameMessage}>{message}</p>}
            </Modal.Body>
            <Modal.Footer>
                {has_cancel && (
                    <Button
                        onClick={onCancel}
                        has_effect
                        text={text_cancel || localize('Maybe later')}
                        secondary
                        {...(is_medium_button ? { medium: true } : { large: true })}
                    />
                )}
                {has_submit && (
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
