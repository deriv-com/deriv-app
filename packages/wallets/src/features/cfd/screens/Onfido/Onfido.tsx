import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useOnfido } from '@deriv/api-v2';
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
    const { formValues, setFormValues } = useFlow();
    // if the user goes back and already submitted Onfido, check the form store first
    const hasAlreadySubmitted = formValues?.hasSubmittedOnfido || hasSubmitted;

    useEffect(() => {
        if (hasSubmitted) {
            setFormValues('hasSubmittedOnfido', hasSubmitted);
            onfidoRef?.current?.safeTearDown();
            switchScreen('poaScreen');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSubmitted, setFormValues, onfidoRef]);

    return (
        <div
            className={classNames('wallets-onfido', {
                'wallets-onfido--success': hasAlreadySubmitted,
            })}
        >
            {!hasAlreadySubmitted && (
                <div className='wallets-onfido__content'>
                    <VerifyDocumentDetails />
                    <div
                        className={classNames('wallets-onfido__wrapper', {
                            'wallets-onfido__wrapper--animate': formValues.verifiedDocumentDetails,
                        })}
                    >
                        {!isServiceTokenLoading && (
                            <>
                                <div
                                    className={classNames('wallets-onfido__wrapper-overlay', {
                                        'wallets-onfido__wrapper-overlay--disabled':
                                            !formValues.verifiedDocumentDetails,
                                    })}
                                >
                                    <div id={onfidoContainerId} />
                                </div>
                                <div
                                    className={classNames('wallets-onfido__wrapper-message', {
                                        'wallets-onfido__wrapper-message--verified': formValues.verifiedDocumentDetails,
                                    })}
                                >
                                    {!formValues.verifiedDocumentDetails ? (
                                        <InlineMessage
                                            message='Hit the checkbox above to choose your document.'
                                            size='sm'
                                            type='information'
                                        />
                                    ) : (
                                        <InlineMessage
                                            message='Your personal details have been saved successfully.'
                                            size='sm'
                                            type='announcement'
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Onfido;
