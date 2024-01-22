import React from 'react';
import { useAuthorize, useSettings, useStatesList } from '@deriv/api';
import FormDropDownField from '../../components/FormFields/FormDropDownField';
import FormInputField from '../../components/FormFields/FormInputField';
import { addressDetailValidations } from './validations';

export const AddressFields = () => {
    const { data: activeAccount } = useAuthorize();
    const { data: settings } = useSettings();

    const { landing_company_name: landingCompanyName, upgradeable_landing_companies: upgradableLandingCompanies } =
        activeAccount;

    const isSvg = landingCompanyName === 'svg' || !!upgradableLandingCompanies?.includes('svg');
    const { data: statesList, isFetched: statesListFetched } = useStatesList(settings.country_code || '', {
        enabled: !!settings.country_code,
    });

    const {
        addressCity: addressCitySchema,
        addressLine1: addressLine1Schema,
        addressLine2: addressLine2Schema,
        addressPostcode: addressPostcodeSchema,
        addressState: addressStateSchema,
    } = addressDetailValidations(settings.country_code || '', isSvg);

    return (
        <div className='space-y-600'>
            <FormInputField
                label='First line of address*'
                name='addressLine1'
                placeholder='First line of address'
                validationSchema={addressLine1Schema}
            />
            <FormInputField
                label='Second line of address'
                name='addressLine2'
                placeholder='Second line of address'
                validationSchema={addressLine2Schema}
            />
            <FormInputField
                label='Town/City*'
                name='addressCity'
                placeholder='Town/City'
                validationSchema={addressCitySchema}
            />
            {statesListFetched && statesList.length ? (
                <FormDropDownField
                    label='State/Province'
                    list={statesList}
                    name='addressState'
                    validationSchema={addressStateSchema}
                />
            ) : (
                <FormInputField
                    label='State/Province'
                    name='addressState'
                    placeholder='State/Province'
                    validationSchema={addressStateSchema}
                />
            )}
            <FormInputField
                label='Postal/ZIP Code'
                name='addressPostcode'
                placeholder='Postal/ZIP Code'
                validationSchema={addressPostcodeSchema}
            />
        </div>
    );
};
