import React from 'react';
import { useFormikContext } from 'formik';
import { FormField, InlineMessage, WalletDropdown, WalletText } from '../../../../../../components';
import { TAddressDetails } from '../../types';
import './AddressSection.scss';

const AddressSection: React.FC = () => {
    const { setFieldValue, status, values } = useFormikContext<TAddressDetails>();

    return (
        <div className='wallets-address-section'>
            <div className='wallets-address-section__title'>
                <WalletText weight='bold'>Address</WalletText>
                <div className='wallets-address-section__title__divider' />
            </div>
            <div className='wallets-address-section__inline'>
                <InlineMessage size='md' type='warning' variant='contained'>
                    <div className='wallets-address-section__inline-message'>
                        For faster verification, input the same address here as in your proof of address document (see
                        section below)
                    </div>
                </InlineMessage>
            </div>
            <div className='wallets-address-section__input'>
                <FormField label='First line of address*' name='firstLine' />
                <FormField label='Second line of address (optional)' name='secondLine' />
                <FormField label='Town/City*' name='townCityLine' />
                <WalletDropdown
                    label='State/Province'
                    list={status.statesList}
                    listHeight='sm'
                    name='stateProvinceLine'
                    onSelect={selectedItem => setFieldValue('stateProvinceLine', selectedItem)}
                    value={values.stateProvinceLine ?? ''}
                />
                <FormField label='Postal/ZIP code' name='zipCodeLine' />
            </div>
        </div>
    );
};

export default AddressSection;
