import React from 'react';
import { DerivLightDeclinedPoiIcon } from '@deriv/quill-icons';
import { ActionScreen, Button } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import { ErrorCode } from '../../utils';
import './UploadErrorMessage.scss';

type TPoiUploadErrorProps = {
    errorCode: keyof typeof ErrorCode;
    onRetry?: () => void;
};

const errorCodeToDescriptionMapper: Record<keyof typeof ErrorCode, string> = {
    DuplicateUpload: 'It seems you’ve submitted this document before. Upload a new document.',
};

const UploadErrorMessage: React.FC<TPoiUploadErrorProps> = ({ errorCode, onRetry }) => {
    const ActionButton = () => (
        <Button onClick={onRetry} size='lg'>
            Try again
        </Button>
    );

    return (
        <ModalStepWrapper title='Submit your proof of identity'>
            <div className='wallets-upload-error-message'>
                <ActionScreen
                    actionButtons={<ActionButton />}
                    description={errorCodeToDescriptionMapper[errorCode]}
                    icon={<DerivLightDeclinedPoiIcon height={120} width={120} />}
                    title='Proof of identity documents upload failed'
                />
            </div>
        </ModalStepWrapper>
    );
};

export default UploadErrorMessage;
