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
                    onSelect={() => null}
                    type='comboBox'
                    value={undefined}
                />
                <WalletDropdown
                    label='Place of birth*'
                    list={residenceList.map(residence => ({
                        text: residence.text as ReactNode,
                        value: residence.value ?? '',
                    }))}
                    onSelect={() => null}
                    type='comboBox'
                    value={undefined}
                />
                <WalletDropdown
                    label='Tax residence*'
                    list={residenceList.map(residence => ({
                        text: residence.text as ReactNode,
                        value: residence.value ?? '',
                    }))}
                    onSelect={() => null}
                    type='comboBox'
                    value={undefined}
                />
                <WalletTextField label='Tax identification number*' onChange={() => null} value={undefined} />
                <WalletDropdown
                    label='Account opening reason*'
                    list={accountOpeningReasonList}
                    onSelect={() => null}
                    type='comboBox'
                    value={undefined}
                />
            </div>
        </div>
    );
};

export default PersonalDetails;
