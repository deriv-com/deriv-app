import React from 'react';
import { DerivLightDeclinedPoaIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import './PoaUploadErrorMessage.scss';

type TPoaUploadErrorMessage = {
    errorCode: string;
    onRetry: VoidFunction;
};

const PoaUploadErrorMessage: React.FC<TPoaUploadErrorMessage> = ({ errorCode, onRetry }) => {
    const { localize } = useTranslations();

    const errorCodeToDescriptionMapper: Record<string, string> = {
        DuplicateUpload: localize("It seems you've submitted this document before. Upload a new document."),
    } as const;

    return (
        <ModalStepWrapper title={localize('Submit your proof of address')}>
            <div className='wallets-poa-upload-error-message'>
                <ActionScreen
                    actionButtons={
                        <Button onClick={onRetry}>
                            <Localize i18n_default_text='Try again' />
                        </Button>
                    }
                    description={errorCodeToDescriptionMapper[errorCode]}
                    icon={<DerivLightDeclinedPoaIcon height={120} width={120} />}
                    title={localize('Proof of address documents upload failed')}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default PoaUploadErrorMessage;
