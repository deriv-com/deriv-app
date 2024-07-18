import React from 'react';
import { useSettings, useStatesList } from '@deriv/api-v2';
import { Dropdown } from '@deriv-com/ui';
import { FlowTextField, useFlow } from '../../../../components';
import { InlineMessage, WalletText } from '../../../../components/Base';
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
                <div className='wallets-address-section__dropdown'>
                    <Dropdown
                        data-testid='dt_wallets_address_section_dropdown'
                        isFullWidth
                        label='State/Province'
                        list={statesList}
                        listHeight='sm'
                        name='stateProvinceDropdownLine'
                        onSelect={selectedItem => setFormValues('stateProvinceDropdownLine', selectedItem)}
                        value={getSettings?.address_state ?? ''}
                    />
                </div>
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
