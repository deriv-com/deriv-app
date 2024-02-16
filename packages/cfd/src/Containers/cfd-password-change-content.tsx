import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DesktopWrapper, Modal, Button, Icon, Text, MobileDialog, MobileWrapper } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TCFDPasswordChangeContentProps = {
    setIsSuccessFlag: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSuccessPasswordChange: React.Dispatch<React.SetStateAction<boolean>>;
    is_success_flag: boolean;
    closeModal: () => void;
    password_value: string;
};

const CFDPasswordChangeContent = observer(
    ({
        setIsSuccessFlag,
        setIsSuccessPasswordChange,
        is_success_flag,
        closeModal,
        password_value,
    }: TCFDPasswordChangeContentProps) => {
        const { modules } = useStore();
        const { cfd } = modules;
        const { submitMt5Password, setCFDSuccessDialog } = cfd;
        const [isOpened, setIsOpened] = React.useState(false);
        const [isSubmitting, setIsSubmitting] = React.useState(false);

        const handleSubmit = async () => {
            closeModal();
            setIsSubmitting(true);
            await submitMt5Password({
                password: password_value,
            });

            setIsOpened(false);
            setIsSuccessPasswordChange(false);
            setIsSuccessFlag(false);
            setIsSubmitting(false);
            closeModal();
            setCFDSuccessDialog(true);
        };

        React.useEffect(() => {
            if (is_success_flag) {
                setIsOpened(true);
            }

            return () => {
                setIsOpened(false);
            };
        }, [is_success_flag]);

        const password_changed_success_content = (
            <div className='cfd-password-change__password-success'>
                <Icon className='cfd-password-change__icon' icon='IcSuccessResetTradingPassword' size={128} />
                <Text as='p' weight='bold' className='cfd-password-change__heading'>
                    <Localize i18n_default_text='Success' />
                </Text>
                <Text align='center' as='p' size='xs' className='cfd-password-change__subtext'>
                    <Localize i18n_default_text='You have a new Deriv MT5 password to log in to your Deriv MT5 accounts on the web and mobile apps.' />
                </Text>
            </div>
        );

        const password_changed_success_content_footer = (
            <div className='cfd-password-change-modal-description--footer'>
                <Button
                    className='cfd-password-change-modal-description--button'
                    type='button'
                    is_loading={isSubmitting}
                    onClick={handleSubmit}
                    primary
                    large
                >
                    <Localize i18n_default_text='Next' />
                </Button>
            </div>
        );

        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        className='cfd-password-modal'
                        has_close_icon
                        is_open={isOpened}
                        toggleModal={closeModal}
                        should_header_stick_body
                        width='auto'
                    >
                        <Modal.Body>{password_changed_success_content}</Modal.Body>
                        <Modal.Footer className='cfd-password-change__content-center'>
                            {password_changed_success_content_footer}
                        </Modal.Footer>
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='modal_root'
                        wrapper_classname='cfd-password-modal'
                        visible={isOpened}
                        onClose={closeModal}
                        has_full_height
                        has_close_icon={false}
                        footer={password_changed_success_content_footer}
                    >
                        {password_changed_success_content}
                    </MobileDialog>
                </MobileWrapper>
            </React.Fragment>
        );
    }
);

export default CFDPasswordChangeContent;
