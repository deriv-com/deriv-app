import React from 'react';
import PepDeclaration from '../_includes/pep_declaration.jsx';
import ProfessionalClient from '../_includes/professional_client.jsx';
import { Fieldset, FormRow } from '../../_common/components/forms.jsx';
import {
    Salutation,
    FirstName,
    LastName,
    DateOfBirth,
    Citizenship,
    Residence,
    AccountOpeningReason,
    AddressLine1,
    AddressLine2,
    AddressCity,
    AddressPostcode,
    AddressState,
    Jurisdiction,
    Phone,
    RiskDisclaimer,
    SecretQuestion,
    SecretAnswer,
    ClientMessage,
    Tnc,
    GeocodeValidation,
} from '../../_common/components/forms_common_rows.jsx';

const Real = () => (
    <div className='gr-12 static_full'>
        <h1>{it.L('Real Money Account Opening')}</h1>
        <form id='frm_real' className='gr-padding-10'>
            <Fieldset legend={it.L('Details')}>
                <Salutation />
                <FirstName />
                <LastName />
                <DateOfBirth />
                <Citizenship row_class='invisible' />
                <FormRow type='select' id='place_of_birth' label={it.L('Place of birth')} attributes={{ single: 'single' }} />
                <Residence />
                <Phone />
                <AccountOpeningReason />
            </Fieldset>

            <Fieldset id='address_form' legend={it.L('Address')}>
                <p className='hint'>{it.L('Please enter your full home address to avoid authentication delays.')}</p>
                <AddressLine1 />
                <AddressLine2 />
                <AddressCity />
                <AddressState />
                <AddressPostcode>
                    <GeocodeValidation className='gr-5 geocode-container' />
                </AddressPostcode>
            </Fieldset>

            <Fieldset legend={it.L('Security')}>
                <SecretQuestion />
                <SecretAnswer />
            </Fieldset>

            <PepDeclaration />
            <ProfessionalClient />
            <Jurisdiction />
            <div className='invisible' id='risk_disclaimer'>
                <RiskDisclaimer />
            </div>

            <Tnc />
        </form>

        <ClientMessage />
    </div>
);

export default Real;
