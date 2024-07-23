import React from 'react';
import { Formik } from 'formik';
import { Loader } from '@deriv-com/ui';
import { FormDropdown, FormField, ModalStepWrapper, WalletText } from '../../../../components';
import { Footer } from '../components';
import { NeedHelpMessage } from './components';
import { useTaxInformation } from './hooks';
import { accountOpeningReasonList, getTinValidator, taxInformationValidator } from './utils';
import './TaxInformation.scss';

type TTaxInformationProps = {
    onCompletion?: VoidFunction;
};

const TaxInformation: React.FC<TTaxInformationProps> = ({ onCompletion }) => {
    const {
        countryCodeToPatternMapper,
        countryList,
        getTaxResidence,
        initialValues,
        isLoading,
        isSubmitted: isTaxInformationSubmitted,
        onSubmit,
    } = useTaxInformation();

    if (isTaxInformationSubmitted && onCompletion) {
        onCompletion();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={taxInformationValidator}>
            {({ errors, handleSubmit, setFieldValue, values }) => {
                const isValid = !!Object.keys(errors).length;

                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disableNext={isValid} onClickNext={handleSubmit} />}
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
                                            label='Citizenship*'
                                            list={countryList}
                                            listHeight='sm'
                                            name='citizenship'
                                            onSelect={selectedItem => setFieldValue('citizenship', selectedItem)}
                                            value={values?.citizenship ?? initialValues?.citizenship}
                                            variant='comboBox'
                                        />
                                        <FormDropdown
                                            disabled={initialValues?.placeOfBirth !== ''}
                                            label='Place of birth*'
                                            list={countryList}
                                            listHeight='sm'
                                            name='placeOfBirth'
                                            onSelect={selectedItem => setFieldValue('placeOfBirth', selectedItem)}
                                            value={initialValues?.placeOfBirth ?? ''}
                                            variant='comboBox'
                                        />
                                        <FormDropdown
                                            errorMessage={values.taxResidence ?? 'Tax residence is required'}
                                            isRequired
                                            label='Tax residence*'
                                            list={countryList}
                                            listHeight='sm'
                                            name='taxResidence'
                                            onChange={value => {
                                                setFieldValue('taxResidence', getTaxResidence(value));
                                            }}
                                            onSelect={selectedItem => {
                                                setFieldValue('taxResidence', selectedItem);
                                            }}
                                            value={values.taxResidence ?? ''}
                                            variant='comboBox'
                                        />
                                        <FormField
                                            label='Tax identification number*'
                                            name='taxIdentificationNumber'
                                            validationSchema={getTinValidator(
                                                countryCodeToPatternMapper[values.taxResidence ?? '']
                                            )}
                                        />
                                        <FormDropdown
                                            label='Account opening reason*'
                                            list={accountOpeningReasonList}
                                            name='accountOpeningReason'
                                            onSelect={selectedItem =>
                                                setFieldValue('accountOpeningReason', selectedItem)
                                            }
                                            value={values.accountOpeningReason ?? ''}
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
