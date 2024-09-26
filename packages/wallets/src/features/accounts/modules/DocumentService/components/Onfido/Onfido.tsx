import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Formik, FormikValues } from 'formik';
import { useOnfido } from '@deriv/api-v2';
import { LegacyAnnouncementIcon, LegacyArrowLeft2pxIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Loader, Text } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import { useVerifyPersonalDetails, VerifyPersonalDetails } from '../VerifyPersonalDetails';
import './Onfido.scss';

type TOnfidoProps = {
    onClickBack?: VoidFunction;
    onCompletion?: VoidFunction;
};

const Onfido: React.FC<TOnfidoProps> = ({ onClickBack, onCompletion }) => {
    const { localize } = useTranslations();
    const { data: onfidoData, isLoading: isOnfidoLoading } = useOnfido();
    const { hasSubmitted: isOnfidoSubmissionSuccessful, onfidoContainerId } = onfidoData;
    const {
        error: errorPersonalDetails,
        initialValues: initialPersonalDetailsValues,
        isLoading: isPersonalDetailsDataLoading,
        isSubmitted: isPersonalDetailsSubmitted,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();

    const isLoading = isPersonalDetailsDataLoading || isOnfidoLoading;

    useEffect(() => {
        if (isOnfidoSubmissionSuccessful && isPersonalDetailsSubmitted && onCompletion) {
            onCompletion();
        }
    }, [isOnfidoSubmissionSuccessful, isPersonalDetailsSubmitted, onCompletion]);

    const onSubmit = (values: FormikValues) => {
        submitPersonalDetails(values);
    };

    if (isLoading) return <Loader />;

    return (
        <ModalStepWrapper disableAnimation={!!onClickBack} title={localize('Add a real MT5 account')}>
            {onClickBack && (
                <button className='wallets-onfido__back-button' onClick={onClickBack}>
                    <LegacyArrowLeft2pxIcon iconSize='xs' />
                    <Text weight='bold'>
                        <Localize i18n_default_text='Back' />
                    </Text>
                </button>
            )}
            <div className='wallets-onfido'>
                <div className='wallets-onfido__content'>
                    <Text weight='bold'>
                        <Localize i18n_default_text='Identity verification' />
                    </Text>
                </div>
                {!isPersonalDetailsSubmitted && (
                    <Formik initialValues={initialPersonalDetailsValues} onSubmit={onSubmit}>
                        {({ handleSubmit }) => {
                            return <VerifyPersonalDetails error={errorPersonalDetails} onVerification={handleSubmit} />;
                        }}
                    </Formik>
                )}
                <div
                    className={classNames('wallets-onfido__wrapper', {
                        'wallets-onfido__wrapper--animate': isPersonalDetailsSubmitted,
                    })}
                >
                    <div className='wallets-onfido__wrapper-onfido-container' id={onfidoContainerId} />
                    {!isPersonalDetailsSubmitted ? (
                        <div className='wallets-onfido__wrapper-overlay'>
                            <InlineMessage className='wallets-onfido__inline-message' variant='info'>
                                <Text size='2xs'>
                                    <Localize i18n_default_text='Hit the checkbox above to choose your document.' />
                                </Text>
                            </InlineMessage>
                        </div>
                    ) : (
                        <InlineMessage
                            className='wallets-onfido__wrapper-banner'
                            icon={<LegacyAnnouncementIcon iconSize='xs' />}
                        >
                            <Text size='2xs'>
                                <Localize i18n_default_text='Your personal details have been saved successfully.' />
                            </Text>
                        </InlineMessage>
                    )}
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default Onfido;
