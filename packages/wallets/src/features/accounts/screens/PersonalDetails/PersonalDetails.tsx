import React, { ReactNode, useEffect } from 'react';
import { useResidenceList, useSettings } from '@deriv/api';
import { FlowTextField, useFlow, WalletDropdown, WalletText } from '../../../../components';
import { accountOpeningReasonList } from './constants';
import './PersonalDetails.scss';

const PersonalDetails = () => {
    const { data: residenceList } = useResidenceList();
    const { formValues, setFormValues } = useFlow();
    const { data: getSettings } = useSettings();

    useEffect(() => {
        if (getSettings) {
            setFormValues('citizenship', getSettings.citizen);
            setFormValues('placeOfBirth', getSettings.place_of_birth);
            setFormValues('taxResidence', getSettings.tax_residence);
            setFormValues('accountOpeningReason', getSettings.account_opening_reason);
        }
    }, [getSettings, setFormValues]);

    return (
        <div className='wallets-personal-details'>
            <div className='wallets-personal-details__header'>
                <WalletText align='center' as='h2' color='prominent' weight='bold'>
                    Complete your personal details
                </WalletText>
                <WalletText align='center' size='xs'>
                    Any information you provide is confidential and will be used for verification purposes only.
                </WalletText>
            </div>
            <div className='wallets-personal-details__form'>
                <WalletDropdown
                    label='Citizenship*'
                    list={residenceList.map(residence => ({
                        text: residence.text as ReactNode,
                        value: residence.value ?? '',
                    }))}
                    name='wallets-personal-details__dropdown-citizenship'
                    onSelect={selectedItem => setFormValues('citizenship', selectedItem)}
                    value={getSettings?.citizen ?? formValues?.citizenship}
                    variant='comboBox'
                />
                <WalletDropdown
                    disabled={getSettings?.place_of_birth !== ''}
                    label='Place of birth*'
                    list={residenceList.map(residence => ({
                        text: residence.text as ReactNode,
                        value: residence.value ?? '',
                    }))}
                    name='wallets-personal-details__dropdown-pob'
                    onSelect={selectedItem => setFormValues('placeOfBirth', selectedItem)}
                    value={getSettings?.place_of_birth ?? ''}
                    variant='comboBox'
                />
                <WalletDropdown
                    errorMessage={'Tax residence is required'}
                    isRequired
                    label='Tax residence*'
                    list={residenceList.map(residence => ({
                        text: residence.text as ReactNode,
                        value: residence.value ?? '',
                    }))}
                    name='wallets-personal-details__dropdown-tax-residence'
                    onChange={inputValue => {
                        residenceList.forEach(residence => {
                            if (residence.text?.toLowerCase() === inputValue.toLowerCase()) {
                                setFormValues('taxResidence', residence.value);
                            }
                        });
                    }}
                    onSelect={selectedItem => {
                        setFormValues('taxResidence', selectedItem);
                    }}
                    value={getSettings?.tax_residence ?? formValues?.taxResidence}
                    variant='comboBox'
                />
                <FlowTextField
                    defaultValue={getSettings?.tax_identification_number ?? formValues?.taxIdentificationNumber}
                    errorMessage={'Please fill in tax residence'}
                    isInvalid={!formValues.taxResidence || !formValues.taxIdentificationNumber}
                    label='Tax identification number*'
                    name='taxIdentificationNumber'
                />
                <WalletDropdown
                    label='Account opening reason*'
                    list={accountOpeningReasonList}
                    name='wallets-personal-details__dropdown-opening-reason'
                    onSelect={selectedItem => setFormValues('accountOpeningReason', selectedItem)}
                    value={getSettings?.account_opening_reason ?? formValues?.accountOpeningReason}
                    variant='comboBox'
                />
            </div>
        </div>
    );
};

export default PersonalDetails;
