import React from 'react';
import { DerivLightUploadPoiIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { getMarketTypeDetails, MARKET_TYPE } from '../../constants';
import { DocumentsList } from './components';
import './ClientVerificationModal.scss';

type TClientVerificationModal = {
    account: THooks.AvailableMT5Accounts;
};

const getDescriptionText = (account: THooks.AvailableMT5Accounts) => {
    const { title } = getMarketTypeDetails(account.product)[account.market_type || MARKET_TYPE.ALL];

    return (
        <Localize
            i18n_default_text={
                'Once your account details are complete, your {{accountName}} account will be ready for you.'
            }
            values={{ accountName: `MT5 ${title}` }}
        />
    );

    return <Localize i18n_default_text='Your account needs verification.' />;
};

const ClientVerificationModal: React.FC<TClientVerificationModal> = ({ account }) => {
    const { isMobile } = useDevice();
    const description = getDescriptionText(account);

    return (
        <ModalStepWrapper title='Default service'>
            <div className='wallets-client-verification-modal'>
                <DerivLightUploadPoiIcon height={128} width={128} />
                <Text align='center' size={isMobile ? 'md' : 'sm'}>
                    {description}
                </Text>
                <DocumentsList statuses={account.client_kyc_status} />
            </div>
        </ModalStepWrapper>
    );
};

export default ClientVerificationModal;
