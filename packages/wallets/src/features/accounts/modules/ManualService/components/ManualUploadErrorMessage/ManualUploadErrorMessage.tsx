import React from 'react';
import { DerivLightDeclinedPoiIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import './ManualUploadErrorMessage.scss';

type TManualUploadErrorMessageProps = {
    errorCode: string;
    onRetry: VoidFunction;
};

const ManualUploadErrorMessage: React.FC<TManualUploadErrorMessageProps> = ({ errorCode, onRetry }) => {
    const { localize } = useTranslations();

    const errorCodeToDescriptionMapper: Record<string, string> = {
        DuplicateUpload: localize("It seems you've submitted this document before. Upload a new document."),
    } as const;

    return (
        <ModalStepWrapper title={localize('Submit your proof of identity')}>
            <div className='wallets-manual-upload-error-message'>
                <ActionScreen
                    actionButtons={
                        <Button onClick={onRetry}>
                            <Localize i18n_default_text='Try again' />
                        </Button>
                    }
                    description={errorCodeToDescriptionMapper[errorCode]}
                    icon={<DerivLightDeclinedPoiIcon height={120} width={120} />}
                    title={localize('Proof of identity documents upload failed')}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default ManualUploadErrorMessage;
