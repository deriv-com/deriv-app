import React from 'react';
import { DerivLightDeclinedPoaIcon } from '@deriv/quill-icons';
import { ActionScreen, Button } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import './PoaUploadErrorMessage.scss';

type TPoaUploadErrorMessage = {
    errorCode: string;
    onRetry?: VoidFunction;
};

const errorCodeToDescriptionMapper: Record<string, string> = {
    DuplicateUpload: "It seems you've submitted this document before. Upload a new document.",
} as const;

const PoaUploadErrorMessage: React.FC<TPoaUploadErrorMessage> = ({ errorCode, onRetry }) => {
    const ActionButtons = () => <Button onClick={onRetry}>Try again</Button>;

    return (
        <ModalStepWrapper title='Submit your proof of address'>
            <div className='wallets-poa-upload-error-message'>
                <ActionScreen
                    actionButtons={<ActionButtons />}
                    description={errorCodeToDescriptionMapper[errorCode]}
                    icon={<DerivLightDeclinedPoaIcon height={120} width={120} />}
                    title='Proof of address documents upload failed'
                />
            </div>
        </ModalStepWrapper>
    );
};

export default PoaUploadErrorMessage;
