import React, { useState } from 'react';
import { useSettings, useStatesList } from '@deriv/api';
import { InlineMessage, WalletDropdown, WalletText, WalletTextField } from '../../../../components/Base';
import './ResubmitPOA.scss';

const ResubmitPOA: React.FC = () => {
    const { data } = useSettings();
    const country = data?.country_code || '';
    const { data: statesList } = useStatesList(country);

    const [selectedState, setSelectedState] = useState('');

    // Will replace this with formik values later
    const handleSelect = (value: string) => {
        setSelectedState(value);
    };

    return (
        <div className='wallets-resubmit-poa'>
            <div className='wallets-resubmit-poa__address'>
                <div className='wallets-resubmit-poa__address--title'>
                    <WalletText weight='bold'>Address</WalletText>
                    <div className='wallets-resubmit-poa__address--title-divider' />
                </div>
                <div className='wallets-resubmit-poa__address--inline'>
                    <InlineMessage size='md' type='warning' variant='contained'>
                        <div className='wallets-resubmit-poa__address--inline-message'>
                            For faster verification, input the same address here as in your proof of address document
                            (see section below)
                        </div>
                    </InlineMessage>
                </div>
                <div className='wallets-resubmit-poa__address--input'>
                    <WalletTextField label='First line of address*' name='first-line' />
                    <WalletTextField label='Second line of address' name='second-line' />
                    <WalletTextField label='Town/City*' name='town-line' />
                    <WalletDropdown
                        label='State/Province'
                        list={statesList}
                        listHeight='sm'
                        name='wallets-resubmit-poa__dropdown'
                        onSelect={handleSelect}
                        value={selectedState}
                    />
                    <WalletTextField label='Postal/ZIP Code' name='zip-line' />
                </div>
            </div>
        </div>
    );
};

export default ResubmitPOA;
