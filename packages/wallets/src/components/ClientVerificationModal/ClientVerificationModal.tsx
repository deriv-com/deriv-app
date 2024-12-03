import React from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import DerivLightUserVerificationIcon from '../../public/images/ic-deriv-light-user-verification.svg';
import { TModifiedMT5Account, TWalletsMFAccountStatus } from '../../types';
import { ModalStepWrapper } from '../Base';
import { DocumentsList } from './components';
import './ClientVerificationModal.scss';

type TClientVerificationModal = {
    account: TModifiedMT5Account | TWalletsMFAccountStatus;
};

const ClientVerificationModal: React.FC<TClientVerificationModal> = ({ account }) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();

    return (
        <ModalStepWrapper
            disableScroll
            title={account.is_added ? localize('Verification required') : localize('Complete your profile')}
        >
            <div className='wallets-client-verification-modal'>
                <DerivLightUserVerificationIcon height={128} width={128} />
                <Text
                    align='center'
                    className='wallets-client-verification-modal__description'
                    size={isMobile ? 'md' : 'sm'}
                >
                    {account.is_added ? (
                        <Localize i18n_default_text='Your account needs verification.' />
                    ) : (
                        <Localize
                            i18n_default_text={
                                'Confirm your details to open the account. After verification, you can begin trading.'
                            }
                        />
                    )}
                </Text>
                <DocumentsList account={account} />
            </div>
        </ModalStepWrapper>
    );
};

export default ClientVerificationModal;
