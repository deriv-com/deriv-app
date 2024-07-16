import React from 'react';
import classNames from 'classnames';
import { Formik } from 'formik';
import { useOnfido } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { InlineMessage, ModalStepWrapper } from '../../../../../../components';
import { useVerifyPersonalDetails, VerifyPersonalDetails } from '../VerifyPersonalDetails';
import './Onfido.scss';

type TOnfidoProps = {
    onCompletion?: () => void;
};

const Onfido: React.FC<TOnfidoProps> = ({ onCompletion }) => {
    const { data: onfidoData, isLoading: isOnfidoLoading } = useOnfido();
    const { hasSubmitted: isOnfidoSubmissionSuccessful, onfidoContainerId } = onfidoData;
    const {
        error: errorPersonalDetails,
        initialFormValues: initialPersonalDetailsValues,
        isLoading: isPersonalDetailsDataLoading,
        isSubmitted: isPersonalDetailsSubmitted,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();

    const isLoading = isPersonalDetailsDataLoading || isOnfidoLoading;

    if (isOnfidoSubmissionSuccessful && isPersonalDetailsSubmitted && onCompletion) {
        onCompletion();
    }

    return (
        <ModalStepWrapper title='Add a real MT5 account'>
            <div className='wallets-onfido'>
                {isLoading && (
                    <div className='wallets-onfido__loader'>
                        <Loader />
                    </div>
                )}
                {!isLoading && (
                    <>
                        {!isPersonalDetailsSubmitted ? (
                            <Formik
                                initialValues={initialPersonalDetailsValues}
                                onSubmit={values => {
                                    submitPersonalDetails(values);
                                }}
                            >
                                {({ handleSubmit }) => (
                                    <VerifyPersonalDetails error={errorPersonalDetails} onVerification={handleSubmit} />
                                )}
                            </Formik>
                        ) : (
                            <div className='wallets-onfido__personal-details-placeholder' />
                        )}
                        <div
                            className={classNames('wallets-onfido__wrapper', {
                                'wallets-onfido__wrapper--animate': isPersonalDetailsSubmitted,
                            })}
                        >
                            <div className='wallets-onfido__wrapper-onfido-container' id={onfidoContainerId} />
                            {!isPersonalDetailsSubmitted ? (
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
                    </>
                )}
            </div>
        </ModalStepWrapper>
    );
};

export default Onfido;
