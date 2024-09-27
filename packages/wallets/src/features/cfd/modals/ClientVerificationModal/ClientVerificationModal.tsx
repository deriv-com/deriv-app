import React from 'react';
import { DerivLightUploadPoiIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { getMarketTypeDetails, MARKET_TYPE } from '../../constants';
import { DocumentsList } from './components';
import './ClientVerificationModal.scss';

type TClientVerificationModal = {
    account: THooks.SortedMT5Accounts;
};

const getDescriptionText = (account: THooks.SortedMT5Accounts) => {
    const { title } = getMarketTypeDetails(account.product)[account.market_type || MARKET_TYPE.ALL];

    if (account.is_added) {
        return <Localize i18n_default_text='Your account needs verification.' />;
    }

    return (
        <Localize
            i18n_default_text={
                'Once your account details are complete, your {{accountName}} account will be ready for you.'
            }
            values={{ accountName: `MT5 ${title}` }}
        />
    );
};

const ClientVerificationModal: React.FC<TClientVerificationModal> = ({ account }) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const description = getDescriptionText(account);

    return (
        <ModalStepWrapper title={account.is_added ? localize('Verify account') : localize('Create account')}>
            <div className='wallets-client-verification-modal'>
                <DerivLightUploadPoiIcon height={128} width={128} />
                <Text align='center' size={isMobile ? 'md' : 'sm'}>
                    {description}
                </Text>
                <DocumentsList account={account} />
            </div>
        </ModalStepWrapper>
    );
};

export default ClientVerificationModal;
