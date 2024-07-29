import React from 'react';
import { DerivLightDeclinedPoiIcon } from '@deriv/quill-icons';
import { ActionScreen, Button } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import './ManualUploadErrorMessage.scss';

type TManualUploadErrorMessageProps = {
    errorCode: string;
    onRetry: VoidFunction;
};

const errorCodeToDescriptionMapper: Record<string, string> = {
    DuplicateUpload: "It seems you've submitted this document before. Upload a new document.",
} as const;

const ManualUploadErrorMessage: React.FC<TManualUploadErrorMessageProps> = ({ errorCode, onRetry }) => {
    const ActionButton = () => <Button onClick={onRetry}>Try again</Button>;

    return (
        <ModalStepWrapper title='Submit your proof of identity'>
            <div className='wallets-manual-upload-error-message'>
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

export default ManualUploadErrorMessage;
