import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Loader, Text } from '@deriv-com/ui';
import { FormDropdown, FormField, ModalStepWrapper } from '../../../../components';
import { Footer } from '../components';
import { NeedHelpMessage } from './components';
import { useTaxInformation } from './hooks';
import {
    getAccountOpeningReasonList,
    getTaxInformationValidationSchema,
    getTaxResidenceValidator,
    getTinValidator,
} from './utils';
import './TaxInformation.scss';

type TTaxInformationProps = {
    onCompletion?: VoidFunction;
    selectedJurisdiction: string;
};

const TaxInformation: React.FC<TTaxInformationProps> = ({ onCompletion, selectedJurisdiction }) => {
    const { localize } = useTranslations();

    const {
        countryCodeToPatternMapper,
        countryList,
        initialValues,
        isLoading,
        isSubmitted: isTaxInformationSubmitted,
        isTinMandatory,
        onSubmit,
    } = useTaxInformation(selectedJurisdiction);

    useEffect(() => {
        if (isTaxInformationSubmitted && onCompletion) {
            onCompletion();
        }
    }, [isTaxInformationSubmitted, onCompletion]);

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnMount
            validationSchema={getTaxInformationValidationSchema(localize)}
        >
            {({ errors, handleSubmit, isValid, values }) => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disableNext={!isValid} onClickNext={handleSubmit} />}
                        title={localize('Add a real MT5 account')}
                    >
                        <div className='wallets-tax-information'>
                            {isLoading && <Loader />}
                            {!isLoading && (
                                <>
                                    <div className='wallets-tax-information__header'>
                                        <Text align='center' as='h2' color='prominent' weight='bold'>
                                            <Localize i18n_default_text='Complete your personal details' />
                                        </Text>
                                        <Text align='center' size='xs'>
                                            <Localize i18n_default_text='Any information you provide is confidential and will be used for verification purposes only.' />
                                        </Text>
                                    </div>
                                    <NeedHelpMessage />
                                    <div className='wallets-tax-information__form'>
                                        <FormDropdown
                                            isFullWidth
                                            label={localize('Citizenship*')}
                                            list={countryList}
                                            listHeight='sm'
                                            name='citizenship'
                                            variant='prompt'
                                        />
                                        <FormDropdown
                                            disabled={initialValues?.placeOfBirth !== ''}
                                            isFullWidth
                                            label={localize('Place of birth*')}
                                            list={countryList}
                                            listHeight='sm'
                                            name='placeOfBirth'
                                            variant='prompt'
                                        />
                                        <FormDropdown
                                            isFullWidth
                                            label={localize('Tax residence*')}
                                            list={countryList}
                                            listHeight='sm'
                                            name='taxResidence'
                                            validationSchema={getTaxResidenceValidator(countryList, localize)}
                                            variant='prompt'
                                        />
                                        {isTinMandatory && (
                                            <FormField
                                                disabled={Boolean(!values.taxResidence || errors.taxResidence)}
                                                label={localize('Tax identification number*')}
                                                name='taxIdentificationNumber'
                                                validationSchema={getTinValidator(
                                                    countryCodeToPatternMapper[values.taxResidence ?? ''],
                                                    localize
                                                )}
                                            />
                                        )}
                                        <FormDropdown
                                            isFullWidth
                                            label={localize('Account opening reason*')}
                                            list={getAccountOpeningReasonList(localize)}
                                            name='accountOpeningReason'
                                            variant='comboBox'
                                        />
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

export default TaxInformation;
