import React                 from 'react';
import Loading               from './loading.jsx';
import { Fieldset, FormRow } from './forms.jsx';

export const Salutation = ({ className, row_class, row_id }) => (
    <FormRow
        type='select'
        className={className}
        id='salutation'
        label={it.L('Title')}
        row_class={row_class}
        row_id={row_id}
    >
        <option value='Mr'>{it.L('Mr')}</option>
        <option value='Mrs' className='ru-hide'>{it.L('Mrs')}</option>
        <option value='Ms'>{it.L('Ms')}</option>
        <option value='Miss' className='ru-hide'>{it.L('Miss')}</option>
    </FormRow>
);

export const FirstName = ({ className, hint, row_class, row_id }) => (
    <FormRow
        type='text'
        id='first_name'
        label={it.L('First name')}
        attributes={{ maxLength: '30', className: className || undefined, 'data-lpignore': true }}
        row_class={row_class}
        row_id={row_id}
        hint={hint}
    />
);

export const LastName = ({ className, hint, row_class, row_id }) => (
    <FormRow
        type='text'
        id='last_name'
        label={it.L('Family name')}
        attributes={{ maxLength: '30', className: className || undefined, 'data-lpignore': true }}
        hint={hint}
        row_id={row_id}
        row_class={row_class}
    />
);

export const DateOfBirth = ({ className, row_class, row_id }) => (
    <FormRow
        type='text'
        id='date_of_birth'
        label={it.L('Date of birth')}
        row_class={row_class}
        row_id={row_id}
        attributes={{ size: '12', readOnly: true, className: className || undefined, 'data-lpignore': true }}
    />
);

export const Citizenship = ({ className, row_class }) => (
    <FormRow
        type='select'
        id='citizen'
        label={it.L('Citizenship')}
        className={className}
        row_class={row_class}
        row_id='citizen_row'
        attributes={{ single: 'single' }}
    />
);

export const Residence = ({ className, row_class, row_id }) => (
    <FormRow
        type='custom'
        id='residence'
        row_class={row_class}
        row_id={row_id}
        className={className || ''}
        label={it.L('Country of residence')}
    >
        <label id='lbl_residence' />
    </FormRow>
);

export const AccountOpeningReason  = ({ row_id, row_class }) => (
    <FormRow
        type='select'
        id='account_opening_reason'
        label={it.L('Account opening reason')}
        row_id={row_id}
        row_class={row_class}
    >
        <option value=''>{it.L('Please select')}</option>
        <option value='Speculative'>{it.L('Speculative')}</option>
        <option value='Income Earning'>{it.L('Income earning')}</option>
        <option value='Hedging'>{it.L('Hedging')}</option>
    </FormRow>
);

export const AddressLine1 = ({ hint }) => (
    <FormRow
        type='text'
        id='address_line_1'
        label={it.L('First line')}
        attributes={{ maxLength: '70', 'data-lpignore': true }}
        hint={hint}
    />
);

export const AddressLine2 = ({ hint }) => (
    <FormRow
        type='text'
        id='address_line_2'
        label={it.L('Second line')}
        attributes={{ maxLength: '70', 'data-lpignore': true }}
        hint={hint}
    />
);

export const AddressCity = ({ hint }) => (
    <FormRow
        type='text'
        id='address_city'
        label={it.L('Town/City')}
        attributes={{ maxLength: 35, 'data-lpignore': true }}
        hint={hint}
    />
);

export const AddressState = () => (
    <FormRow type='select' id='address_state' label={it.L('State/Province')} attributes={{ single: 'single' }} />
);

export const AddressPostcode = ({ children, hint }) => (
    <FormRow
        type='text'
        id='address_postcode'
        label={it.L('Postal/ZIP code')}
        attributes={{ maxLength: '20', 'data-lpignore': true }}
        hint={hint}
        has_geovalidator
        row_class='postcode-form-row'
    >
        {children}
    </FormRow>
);

export const Phone = ({ hint, row_class, row_id }) => (
    <FormRow
        type='text'
        id='phone'
        label={it.L('Contact number')}
        attributes={{ 'data-lpignore': true }}
        hint={hint}
        row_class={row_class}
        row_id={row_id}
    />
);

export const SecretQuestion = () => (
    <FormRow type='select' id='secret_question' label={it.L('Secret question')}>
        <option value='Favourite dish'>{it.L('Favourite dish')}</option>
        <option value="Mother's maiden name">{it.L('Mother\'s maiden name')}</option>
        <option value='Name of your pet'>{it.L('Name of your pet')}</option>
        <option value='Name of first love'>{it.L('Name of first love')}</option>
        <option value='Memorable town/city'>{it.L('Memorable town/city')}</option>
        <option value='Memorable date'>{it.L('Memorable date')}</option>
        <option value='Brand of first car'>{it.L('Brand of first car')}</option>
        <option value='Favourite artist'>{it.L('Favourite artist')}</option>
    </FormRow>
);

export const SecretAnswer = () => (
    <FormRow
        type='text'
        id='secret_answer'
        label={it.L('Answer to secret question')}
        attributes={{ maxLength: '50', autoComplete: 'off', 'data-lpignore': true }}
    />
);

export const Tnc = () => (
    <div className='center-text'>
        <div className='gr-row'>
            <div className='gr-12-m gr-padding-10 gr-centered'>
                <input type='checkbox' name='tnc' id='tnc' />
                <label htmlFor='tnc'>
                    {it.L(
                        'I have read and agree to the [_1]terms and conditions[_2] of the site.',
                        `<a target="_blank" href="${it.url_for('terms-and-conditions')}">`,
                        '</a>'
                    )}
                </label>
            </div>
        </div>

        <button className='button' type='submit'>{it.L('Open account')}</button>
    </div>
);

export const Jurisdiction = () => (
    <Fieldset legend={it.L('Jurisdiction and Choice of Law')}>
        <div className='gr-12'>
            <p>{it.L('Your account will be opened with [_1], and will be subject to the jurisdiction and laws of [_2].', '<span id="lc-name"></span>', '<span id="lc-country"></span>')}</p>
        </div>
    </Fieldset>
);

export const RiskDisclaimer = () => (
    <fieldset>
        <div className='gr-12'>
            <p>{it.L('The financial trading services contained within this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the acquisition of financial contracts. Transactions in financial contracts carry a high degree of risk. If purchased contracts expire worthless, you will suffer a total loss of your investment, which consists of the contract premium.')}</p>
        </div>
    </fieldset>
);

export const ClientMessage = () => (
    <div className='errorbox rbox invisible' id='client_message'>
        <div className='rbox-wrap'>
            <div className='gr-12 rbox-content' id='client_message_content'>
                <p className='center-text notice-msg' />
            </div>
        </div>
    </div>
);

export const TaxInformationForm = () => (
    <React.Fragment>
        <div id='tax_information_info' className='gr-12 gr-padding-10'>
            <label>{it.L('Binary Investments (Europe) Ltd. is required to collect your tax information.')}&nbsp;
                <a id='tax_information_note_toggle' className='toggle-arrow' href='javascript:;'>{it.L('Read more.')}</a>
            </label>

            <div id='tax_information_note' style={{ display: 'none' }}>
                <p>{it.L('This requirement is mandated by the Common Reporting Standard (CRS) and the Foreign Account Tax Compliance Act (FATCA).')}</p>
                <p>{it.L('Please enter your [_1]tax information[_2] below to continue.', '<a href="https://ec.europa.eu/taxation_customs/tin/tinByCountry.html" target="_blank">', '</a>')}</p>
                <p>{it.L('Rest assured that your information will only be used for CRS/FATCA reporting purposes and will be kept safe.')}</p>
                <p>{it.L('If we have reason to believe that your tax information is incomplete, we may contact you for clarification.')}</p>
            </div>
        </div>

        <FormRow
            type='label'
            label={it.L('Tax residence')}
            id='lbl_tax_residence'
            row_id='row_lbl_tax_residence'
            row_class='invisible'
        />
        <FormRow
            type='select'
            label={it.L('Tax residence')}
            tooltip={it.L('Please select the country where you are a tax resident. If you have any doubts, kindly consult your tax advisor.')}
            id='tax_residence'
            row_id='row_tax_residence'
            row_class='invisible'
            attributes={{ single: 'single' }}
        />

        <FormRow
            type='label'
            label={it.L('Tax identification number')}
            id='lbl_tax_identification_number'
            row_id='row_lbl_tax_identification_number'
            row_class='invisible'
        />
        <FormRow
            type='text'
            label={it.L('Tax identification number')}
            tooltip={it.L('Please provide the tax identification number for the country where you are a tax resident. If you cannot provide this information, kindly contact our customer support team.')}
            id='tax_identification_number'
            row_id='row_tax_identification_number'
            row_class='invisible'
            attributes={{ maxLength: 20, 'data-lpignore': true }}
        />

        <div id='tax_information_declaration'>
            <div className='gr-12 gr-padding-10'>
                <input type='checkbox' id='chk_tax_id' />
                <label htmlFor='chk_tax_id'>
                    {it.L('I hereby confirm that the tax information I provided is true and complete. I will also inform Binary Investments (Europe) Ltd. about any changes to this information.')}
                </label>
            </div>
        </div>
    </React.Fragment>
);

export const GeocodeValidation = ({ className }) => (
    <React.Fragment>
        <div className={className}>
            <div className='geocode-btn-container'>
                <a href='javascript:;' id='geocode_validate' className='geocode-btn invisible' ><span>{it.L('Check address')}</span></a>
            </div>
        </div>
        <div id='geocode_status' className='gr-row'>
            <div className='gr-10 gr-centered gr-padding-10 center-text'>
                <Loading is_invisible />
                <p id='geocode_error' className='notice-msg invisible'>
                    {it.L('We could not recognise your address. You may proceed but please ensure that your address is complete and accurate.')}
                </p>
                <div id='geocode_success' className='invisible'>
                    <div className='success-msg'>
                        <ul className='checked'>
                            <li>{it.L('Your address has been recognised by our system.')}</li>
                        </ul>
                        <p>{it.L('However, we will require further documentation to authenticate your account in the future.')}</p>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);
