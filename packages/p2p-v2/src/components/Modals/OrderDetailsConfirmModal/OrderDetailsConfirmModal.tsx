import React, { useState } from 'react';
import { FileUploaderComponent } from '@/components/FileUploaderComponent';
import { getErrorMessage, maxPotFileSize, TFile } from '@/utils';
import { Button, InlineMessage, Modal, Text, useDevice } from '@deriv-com/ui';
import './OrderDetailsConfirmModal.scss';

type TOrderDetailsConfirmModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

type TDocumentFile = {
    errorMessage: string | null;
    files: TFile[];
};

const OrderDetailsConfirmModal = ({ isModalOpen, onRequestClose }: TOrderDetailsConfirmModalProps) => {
    const [documentFile, setDocumentFile] = useState<TDocumentFile>({ errorMessage: null, files: [] });
    const { isMobile } = useDevice();
    const buttonTextSize = isMobile ? 'md' : 'sm';

    const handleAcceptedFiles = (files: TFile[]) => {
        if (files.length > 0) {
            setDocumentFile({ errorMessage: null, files });
        }
    };

    const removeFile = () => {
        setDocumentFile({ errorMessage: null, files: [] });
    };

    const handleRejectedFiles = (files: TFile[]) => {
        setDocumentFile({ errorMessage: getErrorMessage(files), files });
    };

    // TODO: uncomment this when implementing the OrderDetailsConfirmModal
    // const displayPaymentAmount = removeTrailingZeros(
    //     formatMoney(local_currency, amount_display * Number(roundOffDecimal(rate, setDecimalPlaces(rate, 6))), true)
    // );

    return (
        <Modal
            ariaHideApp={false}
            className='p2p-v2-order-details-confirm-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header
                className='border-none lg:py-14 lg:px-[2.4rem] py-4 px-[1.6rem]'
                onRequestClose={onRequestClose}
            >
                <Text size='md' weight='bold'>
                    Payment confirmation
                </Text>
            </Modal.Header>
            <Modal.Body className='flex flex-col lg:px-[2.4rem] px-[1.6rem]'>
                <Text size='sm'>
                    Please make sure that you’ve paid 9.99 IDR to client CR90000012, and upload the receipt as proof of
                    your payment
                </Text>
                <Text className='pt-[0.8rem] pb-[2.4rem]' color='less-prominent' size='sm'>
                    We accept JPG, PDF, or PNG (up to 5MB).
                </Text>
                <InlineMessage className='mb-4' variant='warning'>
                    <Text size={isMobile ? 'xs' : '2xs'}>
                        Sending forged documents will result in an immediate and permanent ban.
                    </Text>
                </InlineMessage>
                <FileUploaderComponent
                    accept='image/png, image/jpeg, image/jpg, application/pdf'
                    hoverMessage='Upload receipt here'
                    maxSize={maxPotFileSize}
                    onClickClose={removeFile}
                    onDropAccepted={handleAcceptedFiles}
                    onDropRejected={handleRejectedFiles}
                    uploadedMessage='Upload receipt here'
                    validationErrorMessage={documentFile.errorMessage}
                    value={documentFile.files}
                />
            </Modal.Body>
            <Modal.Footer className='gap-4 border-none lg:p-[2.4rem] p-[1.6rem]'>
                <Button className='border-2' color='black' size='lg' variant='outlined'>
                    <Text lineHeight='6xl' size={buttonTextSize} weight='bold'>
                        Go Back
                    </Text>
                </Button>
                <Button size='lg'>
                    <Text lineHeight='6xl' size={buttonTextSize} weight='bold'>
                        Confirm
                    </Text>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsConfirmModal;
