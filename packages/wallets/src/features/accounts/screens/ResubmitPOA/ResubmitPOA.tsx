import React, { useState } from 'react';
import { useSettings, useStatesList } from '@deriv/api';
import { InlineMessage, WalletDropdown, WalletText, WalletTextField } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import './ResubmitPOA.scss';

const ResubmitPOA: React.FC = () => {
    const { data } = useSettings();
    const { isMobile } = useDevice();
    const country = data?.country_code || '';
    const { data: statesList } = useStatesList(country);

    const [selectedState, setSelectedState] = useState('');

    // Will replace this with formik values later
    const handleSelect = (value: string) => {
        setSelectedState(value);
    };

    const deviceWidth = isMobile ? '100%' : '84rem';

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
                    <WalletTextField label='First line of address*' maxWidth={deviceWidth} name='first-line' />
                    <WalletTextField label='Second line of address' maxWidth={deviceWidth} name='second-line' />
                    <WalletTextField label='Town/City*' maxWidth={deviceWidth} name='town-line' />
                    <WalletDropdown
                        label='State/Province'
                        list={statesList}
                        listHeight='sm'
                        maxWidth={deviceWidth}
                        onSelect={handleSelect}
                        value={selectedState}
                    />
                    <WalletTextField label='Postal/ZIP Code' maxWidth={deviceWidth} name='zip-line' />
                </div>
            </div>
        </div>
    );
};

export default ResubmitPOA;
