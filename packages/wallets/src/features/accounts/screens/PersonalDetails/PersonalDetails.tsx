import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useResidenceList, useSettings } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { Dropdown, Loader } from '@deriv-com/ui';
import { FlowTextField, InlineMessage, useFlow, WalletText } from '../../../../components';
import { accountOpeningReasonList } from './constants';
import './PersonalDetails.scss';

const PersonalDetails = () => {
    const { data: residenceList, isLoading, isSuccess: isResidenceListSuccess } = useResidenceList();
    const { formValues, setFormValues, setTouched, touched } = useFlow();
    const { data: getSettings } = useSettings();
    const { localize } = useTranslations();
    const countryCodeToPatternMapper = useMemo(() => {
        const countryCodeToPatternMapping: Record<string, string> = {};

        if (isResidenceListSuccess) {
            residenceList.forEach(residence => {
                if (residence.value && !(residence.value in countryCodeToPatternMapping)) {
                    countryCodeToPatternMapping[residence.value] = residence?.tin_format?.[0] ?? '';
                }
            });
        }
        return countryCodeToPatternMapping;
    }, [isResidenceListSuccess, residenceList]);

    const tinValidator = () => {
        const patternStr = countryCodeToPatternMapper[formValues?.taxResidence];
        try {
            if (patternStr) {
                Yup.string()
                    .required('Please fill in Tax identification number')
                    .matches(new RegExp(patternStr), 'The format is incorrect.')
                    .validateSync(formValues?.taxIdentificationNumber);
            } else {
                Yup.string()
                    .required('Please fill in Tax identification number')
                    .validateSync(formValues?.taxIdentificationNumber);
            }
        } catch (err) {
            return (err as Yup.ValidationError).message;
        }
    };

    const taxResidenceValidator = () => {
        try {
            Yup.string().nullable().required('Tax residence is required').validateSync(formValues?.taxResidence);
        } catch (error) {
            if (error instanceof Yup.ValidationError) return error.message;
        }
    };

    useEffect(() => {
        if (getSettings && isResidenceListSuccess) {
            setFormValues('citizenship', getSettings.citizen);
            setFormValues('placeOfBirth', getSettings.place_of_birth);
            setFormValues('taxResidence', getSettings.tax_residence);
            setFormValues('accountOpeningReason', getSettings.account_opening_reason);
        }
    }, [getSettings, setFormValues, isResidenceListSuccess]);

    return (
        <div className='wallets-personal-details'>
            {isLoading && <Loader />}
            {!isLoading && (
                <>
                    <div className='wallets-personal-details__header'>
                        <WalletText align='center' as='h2' color='prominent' weight='bold'>
                            Complete your personal details
                        </WalletText>
                        <WalletText align='center' size='xs'>
                            Any information you provide is confidential and will be used for verification purposes only.
                        </WalletText>
                    </div>
                    <div className='wallets-personal-details__inline'>
                        <InlineMessage type='information' variant='contained'>
                            <WalletText size='xs'>
                                Need help with tax info? Let us know via{' '}
                                <button
                                    className='wallets-link wallets-link__variant--bold'
                                    onClick={() => window.LC_API.open_chat_window()}
                                >
                                    live chat
                                </button>
                                .
                            </WalletText>
                        </InlineMessage>
                    </div>
                    <div className='wallets-personal-details__form'>
                        <div className='wallets-personal-details__dropdown'>
                            <Dropdown
                                data-testid='dt_wallets_personal_details_dropdown_citizenship'
                                emptyResultMessage={localize('No results found')}
                                isFullWidth
                                label='Citizenship*'
                                list={residenceList.map(residence => ({
                                    text: residence.text,
                                    value: residence.value ?? '',
                                }))}
                                listHeight='sm'
                                name='wallets-personal-details__dropdown-citizenship'
                                onBlur={e => {
                                    const matchFound = residenceList.find(
                                        residence =>
                                            residence.text?.toLocaleLowerCase() === e.target.value.toLocaleLowerCase()
                                    );
                                    if (!matchFound) {
                                        setFormValues('citizenship', '');
                                    }
                                }}
                                onSearch={inputValue => {
                                    residenceList.some(residence => {
                                        if (residence.text?.toLowerCase() === inputValue.toLowerCase()) {
                                            setFormValues('citizenship', residence.value);
                                            return true;
                                        }
                                    });
                                }}
                                onSelect={selectedItem => setFormValues('citizenship', selectedItem)}
                                value={formValues?.citizenship ?? getSettings?.citizen}
                            />
                        </div>
                        <div className='wallets-personal-details__dropdown'>
                            <Dropdown
                                data-testid='dt_wallets_personal_details_dropdown_pob'
                                disabled={getSettings?.place_of_birth !== ''}
                                isFullWidth
                                label='Place of birth*'
                                list={residenceList.map(residence => ({
                                    text: residence.text,
                                    value: residence.value ?? '',
                                }))}
                                listHeight='sm'
                                name='wallets-personal-details__dropdown-pob'
                                onSelect={selectedItem => setFormValues('placeOfBirth', selectedItem)}
                                value={getSettings?.place_of_birth ?? ''}
                                variant='comboBox'
                            />
                        </div>
                        <div className='wallets-personal-details__dropdown'>
                            <Dropdown
                                data-testid='dt_wallets_personal_details_dropdown_residence'
                                emptyResultMessage={localize('No results found')}
                                errorMessage={
                                    touched?.taxResidence && !formValues.taxResidence ? taxResidenceValidator() : ''
                                }
                                isFullWidth
                                label='Tax residence*'
                                list={residenceList.map(residence => ({
                                    text: residence.text,
                                    value: residence.value ?? '',
                                }))}
                                listHeight='sm'
                                name='wallets-personal-details__dropdown-tax-residence'
                                onBlur={e => {
                                    const matchFound = residenceList.find(
                                        residence =>
                                            residence.text?.toLocaleLowerCase() === e.target.value.toLocaleLowerCase()
                                    );
                                    if (!matchFound) {
                                        setFormValues('taxResidence', '');
                                    }
                                }}
                                onFocus={() => {
                                    setTouched({ ...touched, taxResidence: true });
                                }}
                                onSearch={inputValue => {
                                    residenceList.some(residence => {
                                        if (residence.text?.toLowerCase() === inputValue.toLowerCase()) {
                                            setFormValues('taxResidence', residence.value);
                                            return true;
                                        }
                                    });
                                }}
                                onSelect={selectedItem => {
                                    setFormValues('taxResidence', selectedItem);
                                }}
                                value={formValues?.taxResidence ?? getSettings?.tax_residence}
                            />
                        </div>
                        <FlowTextField
                            defaultValue={getSettings?.tax_identification_number ?? formValues?.taxIdentificationNumber}
                            errorMessage={!formValues?.taxResidence ? 'Please fill in tax residence' : tinValidator()}
                            isInvalid={
                                !formValues.taxResidence ||
                                !formValues.taxIdentificationNumber ||
                                Boolean(tinValidator())
                            }
                            label='Tax identification number*'
                            name='taxIdentificationNumber'
                        />
                        <div className='wallets-personal-details__dropdown'>
                            <Dropdown
                                data-testid='dt_wallets_personal_details_dropdown_openingreason'
                                isFullWidth
                                label='Account opening reason*'
                                list={accountOpeningReasonList}
                                name='wallets-personal-details__dropdown-opening-reason'
                                onSelect={selectedItem => setFormValues('accountOpeningReason', selectedItem)}
                                value={formValues?.accountOpeningReason ?? getSettings?.account_opening_reason}
                                variant='comboBox'
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PersonalDetails;
