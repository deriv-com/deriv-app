import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormField, Loader, ModalStepWrapper, WalletButton, WalletDropdown, WalletText } from '../../../../components';
import { NeedHelpMessage } from './components';
import { useTaxInformation } from './hooks';
import { accountOpeningReasonList } from './utils';
import './TaxInformation.scss';

type TTaxInformationProps = {
    onCompletion?: () => void;
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

    const getTinValidator = (pattern: string) => {
        if (pattern) {
            return Yup.string()
                .required('Please fill in Tax identification number.')
                .matches(new RegExp(pattern), 'The format is incorrect.');
        }
    };

    const Footer = ({ disabled, onSubmit }: { disabled: boolean; onSubmit: () => void }) => {
        return (
            <div className='wallets-tax-information__footer'>
                <WalletButton disabled={disabled} onClick={onSubmit} type='submit'>
                    Next
                </WalletButton>
            </div>
        );
    };

    if (isTaxInformationSubmitted && onCompletion) {
        onCompletion();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ errors, handleSubmit, setFieldValue, values }) => {
                const isValid = !!Object.keys(errors).length;

                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disabled={isValid} onSubmit={handleSubmit} />}
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
                                        <WalletDropdown
                                            label='Citizenship*'
                                            list={countryList}
                                            listHeight='sm'
                                            name='citizenship'
                                            onSelect={selectedItem => setFieldValue('citizenship', selectedItem)}
                                            value={values?.citizenship ?? initialValues?.citizenship}
                                            variant='comboBox'
                                        />
                                        <WalletDropdown
                                            disabled={initialValues?.placeOfBirth !== ''}
                                            label='Place of birth*'
                                            list={countryList}
                                            listHeight='sm'
                                            name='placeOfBirth'
                                            onSelect={selectedItem => setFieldValue('placeOfBirth', selectedItem)}
                                            value={initialValues?.placeOfBirth ?? ''}
                                            variant='comboBox'
                                        />
                                        <WalletDropdown
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
                                        <WalletDropdown
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
