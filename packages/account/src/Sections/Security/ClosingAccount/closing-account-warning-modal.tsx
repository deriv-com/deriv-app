import { Localize, useTranslations } from '@deriv-com/translations';
import { FormSubmitButton, Icon, Text, Modal } from '@deriv/components';

type TClosingAccountWarningModalProps = {
    show_warning_modal: boolean;
    startDeactivating: () => void;
    closeWarningModal: () => void;
};

const ClosingAccountWarningModal = ({
    show_warning_modal,
    startDeactivating,
    closeWarningModal,
}: TClosingAccountWarningModalProps) => {
    const { localize } = useTranslations();

    return (
        <Modal className='closing-account-reasons' is_open={show_warning_modal} toggleModal={closeWarningModal}>
            <div className='account-closure-warning-modal'>
                <Icon icon='IcRedWarning' size={96} />
                <Text size='xs' weight='bold' className='account-closure-warning-modal__warning-message'>
                    <Localize i18n_default_text='Close your account?' />
                </Text>
                <div className='account-closure-warning-modal__content-wrapper'>
                    <Text as='p' align='center' className='account-closure-warning-modal__content'>
                        <Localize i18n_default_text='Closing your account will automatically log you out. We shall delete your personal information as soon as our legal obligations are met.' />
                    </Text>
                </div>
                <FormSubmitButton
                    label={localize('Close account')}
                    className='account-closure-warning-modal__close-account-button'
                    has_cancel
                    cancel_label={localize('Go Back')}
                    onClick={startDeactivating}
                    onCancel={closeWarningModal}
                />
            </div>
        </Modal>
    );
};
export default ClosingAccountWarningModal;
