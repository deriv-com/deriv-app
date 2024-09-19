import React from 'react';
import { useFormikContext } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Text } from '@deriv-com/ui';
import { FormDropdown, FormField } from '../../../../../../components';
import { TAddressDetails } from '../../types';
import './AddressSection.scss';

const AddressSection: React.FC = () => {
    const { localize } = useTranslations();
    const { status } = useFormikContext<TAddressDetails>();

    return (
        <div className='wallets-address-section'>
            <div className='wallets-address-section__title'>
                <Text weight='bold'>
                    <Localize i18n_default_text='Address' />
                </Text>
                <div className='wallets-address-section__title__divider' />
            </div>
            <div className='wallets-address-section__inline'>
                <InlineMessage variant='warning'>
                    <div className='wallets-address-section__inline-message'>
                        <Localize i18n_default_text='For faster verification, input the same address here as in your proof of address document (see section below)' />
                    </div>
                </InlineMessage>
            </div>
            <div className='wallets-address-section__input'>
                <FormField label={localize('First line of address*')} name='firstLine' />
                <FormField label={localize('Second line of address (optional)')} name='secondLine' />
                <FormField label={localize('Town/City*')} name='townCityLine' />
                <FormDropdown
                    isFullWidth
                    label={localize('State/Province')}
                    list={status.statesList}
                    listHeight='sm'
                    name='stateProvinceLine'
                />
                <FormField label={localize('Postal/ZIP code')} name='zipCodeLine' />
            </div>
        </div>
    );
};

export default AddressSection;
