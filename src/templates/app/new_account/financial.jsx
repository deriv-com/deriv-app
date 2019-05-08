import React from 'react';
import FinancialForm from '../_includes/financial_form.jsx';
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
    AddressState,
    AddressPostcode,
    Jurisdiction,
    Phone,
    RiskDisclaimer,
    SecretQuestion,
    SecretAnswer,
    ClientMessage,
    Tnc,
    TaxInformationForm,
    GeocodeValidation,
} from '../../_common/components/forms_common_rows.jsx';

const Financial = () => (
    <div className='gr-12 static_full'>
        <h1>{it.L('Financial Account Opening')}</h1>

        <form id='financial-form' className='gr-padding-10'>
            <Fieldset legend={it.L('Details')}>
                <Salutation className='input-disabled' />
                <FirstName className='input-disabled' />
                <LastName className='input-disabled' />
                <DateOfBirth className='input-disabled' />
                <Citizenship />
                <FormRow type='select' id='place_of_birth' label={it.L('Place of birth')} attributes={{ single: 'single' }} />
                <Residence />
                <AccountOpeningReason />
                <Phone />
            </Fieldset>

            <Fieldset legend={it.L('Tax information')}>
                <TaxInformationForm />
            </Fieldset>

            <Fieldset id='address_form' legend={it.L('Address')}>
                <p className='hint'>{it.L('Please enter your full address to avoid authentication delays.')}</p>
                <AddressLine1 />
                <AddressLine2 />
                <AddressCity />
                <AddressState />
                <AddressPostcode>
                    <GeocodeValidation className='gr-5 geocode-container' />
                </AddressPostcode>
            </Fieldset>

            <Fieldset legend={it.L('Security')} className='security'>
                <SecretQuestion />
                <SecretAnswer />
            </Fieldset>

            <ProfessionalClient />
            <FinancialForm />
            <PepDeclaration />
            <Jurisdiction />
            <RiskDisclaimer />

            <Tnc />
        </form>

        <form id='financial-risk' className='invisible'>
            <fieldset>
                <div className='gr-12'>
                    <p>{it.L('<strong>Appropriateness Test: WARNING:</strong> In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you (that is, whether you possess the experience and knowledge to understand the risks involved).')}</p>
                    <p>{it.L('On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.')}</p>
                    <p>{it.L('By clicking <strong>Accept</strong> below and proceeding with the Account Opening you should note that you may be exposing yourself to risks (which may be significant, including the risk of loss of the entire sum invested) that you may not have the knowledge and experience to properly assess or mitigate.')}</p>
                    <p className='center-text'>
                        <button className='button' type='submit'>{it.L('Accept')}</button>
                        <a className='button' href={it.url_for('trading')}><span>{it.L('Decline')}</span></a>
                    </p>
                </div>
            </fieldset>
        </form>

        <ClientMessage />
    </div>
);

export default Financial;
