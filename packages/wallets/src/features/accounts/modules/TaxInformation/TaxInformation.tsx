import React from 'react';
import { Formik } from 'formik';
import { Loader } from '@deriv-com/ui';
import { FormDropdown, FormField, ModalStepWrapper, WalletText } from '../../../../components';
import { Footer } from '../components';
import { NeedHelpMessage } from './components';
import { useTaxInformation } from './hooks';
import {
    accountOpeningReasonList,
    getTaxResidenceValidator,
    getTinValidator,
    taxInformationValidationSchema,
} from './utils';
import './TaxInformation.scss';

type TTaxInformationProps = {
    onCompletion?: VoidFunction;
};

const TaxInformation: React.FC<TTaxInformationProps> = ({ onCompletion }) => {
    const {
        countryCodeToPatternMapper,
        countryList,
        initialValues,
        isLoading,
        isSubmitted: isTaxInformationSubmitted,
        onSubmit,
    } = useTaxInformation();

    if (isTaxInformationSubmitted && onCompletion) {
        onCompletion();
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnMount
            validationSchema={taxInformationValidationSchema}
        >
            {({ errors, handleSubmit, isValid, values }) => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disableNext={!isValid} onClickNext={handleSubmit} />}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-tax-information'>
                            {isLoading && <Loader />}
                            {!isLoading && (
                                <>
                                    <div className='wallets-tax-information__header'>
                                        <WalletText align='center' as='h2' color='prominent' weight='bold'>
                                            Complete your personal details
                                        </WalletText>
                                        <WalletText align='center' size='xs'>
                                            Any information you provide is confidential and will be used for
                                            verification purposes only.
                                        </WalletText>
                                    </div>
                                    <NeedHelpMessage />
                                    <div className='wallets-tax-information__form'>
                                        <FormDropdown
                                            isFullWidth
                                            label='Citizenship*'
                                            list={countryList}
                                            listHeight='sm'
                                            name='citizenship'
                                        />
                                        <FormDropdown
                                            disabled={initialValues?.placeOfBirth !== ''}
                                            isFullWidth
                                            label='Place of birth*'
                                            list={countryList}
                                            listHeight='sm'
                                            name='placeOfBirth'
                                        />
                                        <FormDropdown
                                            isFullWidth
                                            label='Tax residence*'
                                            list={countryList}
                                            listHeight='sm'
                                            name='taxResidence'
                                            validationSchema={getTaxResidenceValidator(countryList)}
                                        />
                                        <FormField
                                            disabled={Boolean(!values.taxResidence || errors.taxResidence)}
                                            label='Tax identification number*'
                                            name='taxIdentificationNumber'
                                            validationSchema={getTinValidator(
                                                countryCodeToPatternMapper[values.taxResidence ?? '']
                                            )}
                                        />
                                        <FormDropdown
                                            isFullWidth
                                            label='Account opening reason*'
                                            list={accountOpeningReasonList}
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
