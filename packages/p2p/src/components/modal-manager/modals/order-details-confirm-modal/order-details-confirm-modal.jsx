import React from 'react';
import { useStores } from 'Stores';
import { Button, Modal, Text } from '@deriv/components';
import { isMobile, formatMoney } from '@deriv/shared';
import { localize } from '@deriv/translations';
import FileUploaderComponent from 'Components/file-uploader-component';
import FormError from 'Components/form/error.jsx';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { getErrorMessage, max_pot_file_size } from 'Utils/file-uploader';
import { removeTrailingZeros, roundOffDecimal, setDecimalPlaces } from 'Utils/format-value';
import 'Components/order-details/order-details-confirm-modal.scss';

const OrderDetailsConfirmModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { order_details_store, order_store, sendbird_store } = useStores();
    const { amount_display, local_currency, other_user_details, rate, id } = order_store.order_information;
    const [document_file, setDocumentFile] = React.useState({ files: [], error_message: null });

    const handleAcceptedFiles = files => {
        if (files.length > 0) {
            setDocumentFile({ files, error_message: null });
        }
    };

    const removeFile = () => {
        setDocumentFile({ files: [], error_message: null });
    };

    const handleRejectedFiles = files => {
        setDocumentFile({ files, error_message: getErrorMessage(files) });
    };

    const display_payment_amount = removeTrailingZeros(
        formatMoney(local_currency, amount_display * roundOffDecimal(rate, setDecimalPlaces(rate, 6)), true)
    );

    return (
        <React.Fragment>
            <Modal
                className='order-details-confirm-modal'
                is_open={is_modal_open}
                toggleModal={hideModal}
                has_close_icon
                renderTitle={() => (
                    <Text
                        color='prominent'
                        line-height={isMobile() ? 'xl' : 'xxl'}
                        size={isMobile() ? 'xs' : 's'}
                        weight='bold'
                    >
                        <Localize i18n_default_text='Payment confirmation' />
                    </Text>
                )}
                width='44rem'
            >
                <Modal.Body className='order-details-confirm-modal__body'>
                    <Text color='general' line-height='xl' size={isMobile() ? 'xxs' : 'xs'}>
                        <Localize
                            i18n_default_text="Please make sure that you've paid {{amount}} {{currency}} to {{other_user_name}}, and upload the receipt as proof of your payment"
                            values={{
                                amount: display_payment_amount,
                                currency: local_currency,
                                other_user_name: other_user_details.name,
                            }}
                        />
                    </Text>
                    <Text
                        color='less-prominent'
                        line-height='xl'
                        size={isMobile() ? 'xxs' : 'xs'}
                        as='div'
                        className='order-details-confirm-modal__file_format'
                    >
                        <Localize i18n_default_text='We accept JPG, PDF, or PNG (up to 2MB).' />
                    </Text>
                    <FileUploaderComponent
                        accept='image/png, image/jpeg, image/jpg, application/pdf'
                        filename_limit={26}
                        hover_message={localize('Upload receipt here')}
                        max_size={max_pot_file_size}
                        multiple={false}
                        onDropAccepted={handleAcceptedFiles}
                        onDropRejected={handleRejectedFiles}
                        validation_error_message={document_file.error_message}
                        value={document_file.files}
                        onClickClose={removeFile}
                        upload_message={localize('Upload receipt here')}
                    />
                </Modal.Body>
                <Modal.Footer className='order-details-confirm-modal__footer'>
                    {order_details_store.error_message && <FormError message={order_details_store.error_message} />}
                    <Button.Group>
                        <Button secondary type='button' onClick={hideModal} large>
                            <Localize i18n_default_text='Go Back' />
                        </Button>
                        <Button
                            is_disabled={document_file.files?.length === 0 || document_file.error_message}
                            primary
                            large
                            onClick={() => {
                                sendbird_store.sendFile(document_file.files[0]);
                                hideModal();
                                order_store.confirmOrderRequest(id, true);
                            }}
                        >
                            <Localize i18n_default_text='Confirm' />
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default OrderDetailsConfirmModal;
