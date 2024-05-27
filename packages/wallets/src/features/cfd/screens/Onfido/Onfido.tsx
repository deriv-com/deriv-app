import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useOnfido } from '@deriv/api-v2';
import { InlineMessage } from '../../../../components';
import { useFlow } from '../../../../components/FlowProvider';
import { WalletsActionScreen } from '../../../../components/WalletsActionScreen';
import POISubmittedIcon from '../../../../public/images/accounts/ic-poi-submitted.svg';
import { VerifyDocumentDetails } from '../../../accounts';
import './Onfido.scss';

const Onfido = () => {
    const {
        data: { hasSubmitted, onfidoContainerId, onfidoRef },
    } = useOnfido();
    const { formValues, setFormValues } = useFlow();
    // if the user goes back and already submitted Onfido, check the form store first
    const hasAlreadySubmitted = formValues?.hasSubmittedOnfido || hasSubmitted;

    useEffect(() => {
        if (hasSubmitted) {
            setFormValues('hasSubmittedOnfido', hasSubmitted);
            onfidoRef?.current?.safeTearDown();
        }
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
                        <div
                            className={classNames('wallets-onfido__wrapper-overlay', {
                                'wallets-onfido__wrapper-overlay--disabled': !formValues.verifiedDocumentDetails,
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
                    </div>
                </div>
            )}
            {hasAlreadySubmitted && (
                <WalletsActionScreen
                    description='We’ll review your documents and notify you of its status within 5 minutes.'
                    icon={<POISubmittedIcon />}
                    title='Your proof of identity was submitted successfully'
                />
            )}
        </div>
    );
};

export default Onfido;
