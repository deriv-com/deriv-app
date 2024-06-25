import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useOnfido, usePOA } from '@deriv/api-v2';
import { InlineMessage } from '../../../../components';
import { useFlow } from '../../../../components/FlowProvider';
import { VerifyDocumentDetails } from '../../../accounts';
import './Onfido.scss';

const Onfido = () => {
    const {
        data: { hasSubmitted, onfidoContainerId, onfidoRef },
        isServiceTokenLoading,
    } = useOnfido();
    const { switchScreen } = useFlow();
    const { data: poaStatus } = usePOA();
    const { formValues, setFormValues } = useFlow();
    // if the user goes back and already submitted Onfido, check the form store first

    useEffect(() => {
        if (hasSubmitted) {
            setFormValues('hasSubmittedOnfido', hasSubmitted);
            onfidoRef?.current?.safeTearDown();
            // @ts-expect-error as the prop verified_jurisdiction is not yet present in GetAccountStatusResponse type
            if (!poaStatus?.is_pending && !poaStatus?.verified_jurisdiction?.[formValues.selectedJurisdiction]) {
                switchScreen('poaScreen');
            } else {
                switchScreen('poiPoaDocsSubmitted');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSubmitted, poaStatus, formValues.selectedJurisdiction, setFormValues, onfidoRef]);

    return (
        <div className='wallets-onfido'>
            <VerifyDocumentDetails />
            {!isServiceTokenLoading && (
                <div
                    className={classNames('wallets-onfido__wrapper', {
                        'wallets-onfido__wrapper--animate': formValues.verifiedDocumentDetails,
                    })}
                >
                    <div className='wallets-onfido__wrapper-onfido-container' id={onfidoContainerId} />
                    {!formValues.verifiedDocumentDetails ? (
                        <div className='wallets-onfido__wrapper-overlay'>
                            <InlineMessage
                                message='Hit the checkbox above to choose your document.'
                                size='sm'
                                type='information'
                            />
                        </div>
                    ) : (
                        <InlineMessage
                            message='Your personal details have been saved successfully.'
                            size='sm'
                            type='announcement'
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Onfido;
