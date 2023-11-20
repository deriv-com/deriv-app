import React, { ReactNode } from 'react';
import { useResidenceList } from '@deriv/api';
import { WalletDropdown, WalletText, WalletTextField } from '../../../../components';
import { accountOpeningReasonList } from './constants';
import './PersonalDetails.scss';

const PersonalDetails = () => {
    const { data: residenceList } = useResidenceList();

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
                    onSelect={() => null}
                    value={undefined}
                    variant='comboBox'
                />
                <WalletDropdown
                    label='Place of birth*'
                    list={residenceList.map(residence => ({
                        text: residence.text as ReactNode,
                        value: residence.value ?? '',
                    }))}
                    name='wallets-personal-details__dropdown-pob'
                    onSelect={() => null}
                    value={undefined}
                    variant='comboBox'
                />
                <WalletDropdown
                    label='Tax residence*'
                    list={residenceList.map(residence => ({
                        text: residence.text as ReactNode,
                        value: residence.value ?? '',
                    }))}
                    name='wallets-personal-details__dropdown-tax-residence'
                    onSelect={() => null}
                    value={undefined}
                    variant='comboBox'
                />
                <WalletTextField label='Tax identification number*' onChange={() => null} value={undefined} />
                <WalletDropdown
                    label='Account opening reason*'
                    list={accountOpeningReasonList}
                    name='wallets-personal-details__dropdown-opening-reason'
                    onSelect={() => null}
                    value={undefined}
                    variant='comboBox'
                />
            </div>
        </div>
    );
};

export default PersonalDetails;
