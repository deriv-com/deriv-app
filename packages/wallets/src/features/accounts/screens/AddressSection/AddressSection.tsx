import React from 'react';
import { useSettings, useStatesList } from '@deriv-lib/api-v2';
import { FlowTextField, useFlow } from '../../../../components';
import { InlineMessage, WalletDropdown, WalletText } from '../../../../components/Base';
import {
    addressFirstLineValidator,
    addressSecondLineValidator,
    cityValidator,
    postcodeValidator,
} from '../../validations';
import './AddressSection.scss';

const AddressSection: React.FC = () => {
    const { setFormValues } = useFlow();
    const { data: getSettings } = useSettings();
    const country = getSettings?.country_code ?? '';
    const { data: statesList } = useStatesList(country);

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
                <FlowTextField
                    defaultValue={getSettings?.address_line_1 ?? ''}
                    label='First line of address*'
                    name='firstLine'
                    validationSchema={addressFirstLineValidator}
                />
                <FlowTextField
                    defaultValue={getSettings?.address_line_2 ?? ''}
                    label='Second line of address (optional)'
                    name='secondLine'
                    validationSchema={addressSecondLineValidator}
                />
                <FlowTextField
                    defaultValue={getSettings?.address_city ?? ''}
                    label='Town/City*'
                    name='townCityLine'
                    validationSchema={cityValidator}
                />
                <WalletDropdown
                    label='State/Province'
                    list={statesList}
                    listHeight='sm'
                    name='stateProvinceDropdownLine'
                    onSelect={selectedItem => setFormValues('stateProvinceDropdownLine', selectedItem)}
                    value={getSettings?.address_state ?? ''}
                />
                <FlowTextField
                    defaultValue={getSettings?.address_postcode ?? ''}
                    label='Postal/ZIP code'
                    name='zipCodeLine'
                    validationSchema={postcodeValidator}
                />
            </div>
        </div>
    );
};

export default AddressSection;
