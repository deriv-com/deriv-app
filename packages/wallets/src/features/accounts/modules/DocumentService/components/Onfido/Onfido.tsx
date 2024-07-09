import React from 'react';
import classNames from 'classnames';
import { Formik } from 'formik';
import { InlineMessage, Loader, ModalStepWrapper } from '../../../../../../components';
import { useVerifyPersonalDetails, VerifyPersonalDetails } from '../VerifyPersonalDetails';
import { useOnfidoService } from './hooks';
import './Onfido.scss';

type TOnfidoProps = {
    onCompletion?: () => void;
};

const Onfido: React.FC<TOnfidoProps> = ({ onCompletion }) => {
    const { isLoading: isOnfidoLoading, isOnfidoSubmissionSuccessful, onfidoContainerId } = useOnfidoService();
    const {
        error: errorPersonalDetails,
        initialFormValues: initialPersonalDetailsValues,
        isLoading: isPersonalDetailsDataLoading,
        isSubmitted: isPersonalDetailsSubmitted,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();

    const isLoading = isPersonalDetailsDataLoading || isOnfidoLoading;

    const onSubmit = () => {
        if (onCompletion) {
            onCompletion();
        }
    };

    return (
        <Formik initialValues={initialPersonalDetailsValues} onSubmit={onSubmit}>
            {({ handleSubmit, values }) => {
                if (isOnfidoSubmissionSuccessful && isPersonalDetailsSubmitted) {
                    handleSubmit();
                }
                return (
                    <ModalStepWrapper>
                        <div className='wallets-onfido'>
                            {isLoading && (
                                <div className='wallets-onfido__loader'>
                                    <Loader />
                                </div>
                            )}
                            {!isLoading && (
                                <>
                                    {!isPersonalDetailsSubmitted ? (
                                        <VerifyPersonalDetails
                                            error={errorPersonalDetails}
                                            onVerification={() => {
                                                submitPersonalDetails(values);
                                            }}
                                        />
                                    ) : (
                                        <div className='wallets-onfido__personal-details-placeholder' />
                                    )}
                                    <div
                                        className={classNames('wallets-onfido__wrapper', {
                                            'wallets-onfido__wrapper--animate': isPersonalDetailsSubmitted,
                                        })}
                                    >
                                        <div
                                            className='wallets-onfido__wrapper-onfido-container'
                                            id={onfidoContainerId}
                                        />
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
            }}
        </Formik>
    );
};

export default Onfido;
