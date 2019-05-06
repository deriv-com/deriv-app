import React                                            from 'react';
import { FormRow, SubmitButton, Fieldset }              from '../../../_common/components/forms.jsx';
import {
    AccountOpeningReason,
    AddressLine1,
    AddressLine2,
    AddressCity,
    AddressState,
    AddressPostcode,
    DateOfBirth,
    FirstName,
    GeocodeValidation,
    LastName,
    Phone,
    Salutation,
    TaxInformationForm,
}                                                       from '../../../_common/components/forms_common_rows.jsx';
import Loading                                          from '../../../_common/components/loading.jsx';

const PersonalDetails = () => (
    <React.Fragment>
        <h1>{it.L('Personal details')}</h1>

        <p className='notice-msg center-text invisible' id='missing_details_notice'>
            {it.L('Please complete your personal details before you proceed.')}
        </p>

        <div id='loading'>
            <Loading />
        </div>

        <div id='msg_main' className='invisible'>
            <p>{it.L('Thank you for completing your Personal Details. You can now deposit funds and trade Forex with real money on MetaTrader 5.')}</p>
            <div className='center-text'>
                <a className='button' href={it.url_for('user/metatrader')}>
                    <span>{it.L('Go to MetaTrader 5 dashboard')}</span>
                </a>
            </div>
        </div>

        <form className='form gr-padding-10 invisible' id='frmPersonalDetails'>
            <Fieldset legend={it.L('Details')}>
                <Salutation row_class='invisible'  row_id='row_salutation' />
                <FirstName row_class='invisible' row_id='row_first_name' />
                <LastName row_class='invisible' row_id='row_last_name' />
                <FormRow type='label'  label={it.L('Name')} is_bold id='name' row_class='invisible RealAcc' row_id='row_name' />
                <FormRow type='label'  label={it.L('Date of birth')} is_bold id='lbl_date_of_birth' row_id='row_lbl_date_of_birth' row_class='invisible RealAcc' />
                <DateOfBirth className='RealAcc' row_class='invisible' row_id='row_date_of_birth' />
                <FormRow type='label'  label={it.L('Place of birth')} id='lbl_place_of_birth' row_id='row_lbl_place_of_birth' row_class='invisible' />
                <FormRow type='select' label={it.L('Place of birth')} id='place_of_birth' row_id='row_place_of_birth' row_class='invisible' attributes={{ single: 'single' }} />
                <FormRow type='label'  label={it.L('Citizenship')} id='lbl_citizen' row_id='row_lbl_citizen' row_class='invisible' />
                <FormRow type='select' label={it.L('Citizenship')} id='citizen' row_id='row_citizen' row_class='invisible' attributes={{ single: 'single' }} />
                <FormRow type='label'  label={it.L('Country of residence')} is_bold id='country' row_id='row_lbl_country' />
                <FormRow type='label'  label={it.L('Email address')} is_bold id='email' row_id='row_lbl_email' />
                <FormRow type='label'  label={it.L('Account opening reason')} id='lbl_account_opening_reason' row_id='row_lbl_account_opening_reason' row_class='invisible' />
                <Phone row_class='invisible RealAcc' row_id='row_phone' />
                <AccountOpeningReason row_id='row_account_opening_reason' row_class='invisible' />
            </Fieldset>

            <Fieldset id='tax_information_form' className='invisible RealAcc' legend={it.L('Tax information')}>
                <TaxInformationForm />
            </Fieldset>

            <Fieldset id='address_form' className='invisible RealAcc' legend={it.L('Address')}>
                <p className='hint'>{it.L('Please enter your full home address to avoid authentication delays.')}</p>
                <AddressLine1 no_hint />
                <AddressLine2 />
                <AddressCity />
                <AddressState />
                <AddressPostcode>
                    <GeocodeValidation className='gr-5 geocode-container' />
                </AddressPostcode>
            </Fieldset>

            <Fieldset id='fieldset_email_consent' legend={it.L('Email preference')}>
                <FormRow type='checkbox' label={it.L('Receive emails on [_1] products, services, and events.', it.website_name)} id='email_consent' label_row_id='email_consent_label' />
            </Fieldset>

            <SubmitButton is_centered id='btn_update' msg_id='formMessage' type='submit' text={it.L('Update')} className='gr-6 gr-centered' />
        </form>

        <p className='required invisible RealAcc rowCustomerSupport'>{it.L('To change your name, date of birth, country of residence, email, or tax information, please contact [_1]Customer Support[_2].', `<a href='${it.url_for('contact')}'>`, '</a>')}</p>
    </React.Fragment>
);

export default PersonalDetails;
