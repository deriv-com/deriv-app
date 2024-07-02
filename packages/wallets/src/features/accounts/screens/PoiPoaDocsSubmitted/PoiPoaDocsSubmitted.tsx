import React, { useEffect } from 'react';
import { useInvalidateQuery } from '@deriv/api-v2';
import { DerivLightWaitingPoiIcon } from '@deriv/quill-icons';
import { useFlow, WalletButton, WalletsActionScreen } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import './PoiPoaDocsSubmitted.scss';

const PoiPoaDocsSubmitted = () => {
    const invalidate = useInvalidateQuery();
    const { hide } = useModal();
    const { formValues } = useFlow();

    // need invalidate queries in order to update status badge of CFD account
    useEffect(() => {
        return () => {
            invalidate('get_account_status');
            invalidate('mt5_login_list');
        };
    }, [invalidate]);

    return (
        <div className='wallets-poi-poa-submitted'>
            <WalletsActionScreen
                description={
                    formValues.service === 'manual'
                        ? "We'll review your documents and notify you of its status within 1 - 3 working days."
                        : "We'll review your documents and notify you of its status within 5 minutes."
                }
                icon={<DerivLightWaitingPoiIcon height={128} width={128} />}
                renderButtons={() => (
                    <WalletButton onClick={hide} size='lg'>
                        Ok
                    </WalletButton>
                )}
                title='Your documents were submitted successfully'
            />
        </div>
    );
};

export default PoiPoaDocsSubmitted;
