import React from 'react';
import { DerivLightUploadPoiIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { DocumentsList } from './components';
import './ClientVerificationModal.scss';

const getDescriptionText = () => {
    return (
        <Localize
            i18n_default_text={
                'Once your account details are complete, your {{accountName}} account will be ready for you.'
            }
        />
    );

    return <Localize i18n_default_text='Your account needs verification.' />;
};

const ClientVerificationModal = () => {
    const { isMobile } = useDevice();
    const description = getDescriptionText();

    return (
        <ModalStepWrapper title='Default service'>
            <div className='wallets-client-verification-modal'>
                <DerivLightUploadPoiIcon height={128} width={128} />
                <Text align='center' size={isMobile ? 'md' : 'sm'}>
                    {description}
                </Text>
                <DocumentsList />
            </div>
        </ModalStepWrapper>
    );
};

export default ClientVerificationModal;
