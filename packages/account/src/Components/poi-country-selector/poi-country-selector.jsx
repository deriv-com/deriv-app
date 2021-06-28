import React from 'react';
import { Autocomplete, Button, DesktopWrapper, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';

import FormFooter from 'Components/form-footer';

const CountrySelector = ({ handleSelectionNext, residence_list, setSelectedCountry }) => {
    const [country_list, setCountryList] = React.useState([]);

    const initial_form_values = {
        country_input: '',
    };

    const validateFields = values => {
        const errors = {};
        const { country_input } = values;

        if (!country_input) {
            errors.country_input = localize('Please select the country of document issuance.');
        } else if (!country_list.find(c => c.text === country_input)) {
            errors.country_input = localize('Please select a valid country of document issuance.');
        }

        return errors;
    };

    const submitHandler = (values, { setSubmitting }) => {
        const matching_country = country_list.find(c => c.text === values.country_input);
        if (matching_country) {
            setSelectedCountry(matching_country);
            setSubmitting(false);
            handleSelectionNext();
        }
    };

    React.useEffect(() => {
        const enabled_countries = residence_list.filter(r => !r.disabled);
        setCountryList(enabled_countries);
    }, [residence_list]);

    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={submitHandler}>
            {({ dirty, errors, handleChange, handleSubmit, isSubmitting, isValid, setFieldValue, touched, values }) => (
                <React.Fragment>
                    <div className='proof-of-identity__container'>
                        <Text className='proof-of-identity__header' align='center' weight='bold'>
                            {localize('Proof of Identity')}
                        </Text>
                        <Text className='proof-of-identity__country-text ' size='xs'>
                            {localize('In which country was your document issued?')}
                        </Text>
                        <fieldset className='proof-of-identity__fieldset'>
                            <Field name='country_input'>
                                {({ field }) => (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <Autocomplete
                                                {...field}
                                                name='country_input'
                                                data-lpignore='true'
                                                error={touched.country_input && errors.country_input}
                                                autoComplete='off'
                                                type='text'
                                                label={localize('Country')}
                                                list_items={country_list}
                                                value={values.country_input}
                                                onChange={handleChange}
                                                onItemSelection={({ text }) => {
                                                    setFieldValue('country_input', text || '', true);
                                                    setSelectedCountry(country_list.find(c => c.text === text));
                                                }}
                                                required
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <div className='proof-of-identity__dropdown-container'>
                                                <SelectNative
                                                    {...field}
                                                    name='country_input'
                                                    error={touched.country_input && errors.country_input}
                                                    placeholder={localize('Place of birth')}
                                                    label={localize('Country')}
                                                    list_items={country_list}
                                                    value={values.country_input}
                                                    onChange={handleChange}
                                                    use_text={true}
                                                    required
                                                />
                                            </div>
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                    </div>
                    <FormFooter className='proof-of-identity__footer'>
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            onClick={handleSubmit}
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            is_loading={false}
                            text={localize('Next')}
                            large
                            primary
                        />
                    </FormFooter>
                </React.Fragment>
            )}
        </Formik>
    );
};

export default CountrySelector;
