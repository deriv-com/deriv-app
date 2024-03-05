import React from 'react';
import { useAuthorize, useSettings, useStatesList } from '@deriv/api-v2';
import { FormDropDownField, FormInputField } from '../../components/FormFields';
import { LANDING_COMPANY } from '../../constants/constants';
import { addressDetailValidations } from './validations';

export const AddressFields = () => {
    const { data: activeAccount } = useAuthorize();
    const { data: settings } = useSettings();

    const { landing_company_name: landingCompanyName, upgradeable_landing_companies: upgradableLandingCompanies } =
        activeAccount;

    const isSvg =
        landingCompanyName === LANDING_COMPANY.SVG || !!upgradableLandingCompanies?.includes(LANDING_COMPANY.SVG);
    const { data: statesList, isFetched: statesListFetched } = useStatesList(settings.country_code ?? '', {
        enabled: !!settings.country_code,
    });

    const {
        addressCity: addressCitySchema,
        addressLine1: addressLine1Schema,
        addressLine2: addressLine2Schema,
        addressPostcode: addressPostcodeSchema,
        addressState: addressStateSchema,
    } = addressDetailValidations(settings.country_code ?? '', isSvg);

    return (
        <div className='grid pt-8 space-y-12 grid-col-1'>
            <FormInputField label='First line of address*' name='addressLine1' validationSchema={addressLine1Schema} />
            <FormInputField label='Second line of address' name='addressLine2' validationSchema={addressLine2Schema} />
            <FormInputField label='Town/City*' name='addressCity' validationSchema={addressCitySchema} />
            {statesListFetched && statesList.length ? (
                <FormDropDownField
                    label='State/Province'
                    list={statesList}
                    name='addressState'
                    validationSchema={addressStateSchema}
                />
            ) : (
                <FormInputField label='State/Province' name='addressState' validationSchema={addressStateSchema} />
            )}
            <FormInputField label='Postal/ZIP Code' name='addressPostcode' validationSchema={addressPostcodeSchema} />
        </div>
    );
};
