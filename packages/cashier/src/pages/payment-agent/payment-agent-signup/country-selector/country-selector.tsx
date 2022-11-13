import React from 'react';
import { connect } from 'Stores/connect';
import { ResidenceList, CountriesListResponse } from '@deriv/api-types';
import { Formik, Field, FieldProps } from 'formik';
import { Autocomplete, DesktopWrapper, MobileWrapper, SelectNative, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TRootStore, TReactChangeEvent } from 'Types';

type TCountrySelectorProps = {
    fetchResidenceList: () => Promise<CountriesListResponse>;
    selectedCountry: (country: ResidenceList[0]) => void;
    className: string;
};

type TValues = {
    country_input: string;
};

const CountrySelector = ({ fetchResidenceList, selectedCountry, className }: TCountrySelectorProps) => {
    const [residence_list, setResidenceList] = React.useState<ResidenceList>();

    const initial_form_values = {
        country_input: '',
    };

    const validateFields = (values: TValues) => {
        const errors: TValues = {
            country_input: '',
        };
        const { country_input } = values;

        if (!country_input) {
            errors.country_input = localize('Please select the country of document issuance.');
        } else if (!residence_list?.find(c => c.text === country_input)) {
            errors.country_input = localize('Please select a valid country of document issuance.');
        }

        return errors;
    };

    const submitCountry = (values: TValues) => {
        const matching_country = residence_list?.find(c => c.text === values.country_input);
        if (matching_country) {
            selectedCountry(matching_country);
        }
    };

    React.useEffect(() => {
        fetchResidenceList().then((response: CountriesListResponse) => {
            setResidenceList(response.residence_list);
        });
    }, [fetchResidenceList]);

    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={submitCountry}>
            {({ errors, handleBlur, handleChange, setFieldValue, touched, values }) => (
                <div className={className}>
                    {residence_list && residence_list.length ? (
                        <fieldset className='proof-of-identity__fieldset'>
                            <Field name='country_input'>
                                {({ field }: FieldProps<string>) => (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <Autocomplete
                                                {...field}
                                                name='country_input'
                                                className='is-desktop'
                                                error={touched.country_input && errors.country_input}
                                                autoComplete='off'
                                                type='text'
                                                label={localize('Country')}
                                                list_items={residence_list}
                                                value={values.country_input}
                                                onBlur={(e: TReactChangeEvent) => {
                                                    handleBlur(e);
                                                    const current_input = e.target.value;
                                                    if (!residence_list?.find(c => c.text === current_input)) {
                                                        setFieldValue('country_input', '', true);
                                                        submitCountry({ country_input: '' });
                                                    }
                                                }}
                                                onChange={handleChange}
                                                onItemSelection={({ text }: { text: string }) => {
                                                    const select_value =
                                                        text === 'No results found' || !text ? '' : text;
                                                    setFieldValue('country_input', select_value, true);
                                                    submitCountry({ country_input: select_value });
                                                }}
                                                required
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <div className='proof-of-identity__dropdown-container'>
                                                <SelectNative
                                                    {...field}
                                                    name='country_input'
                                                    className='is-mobile'
                                                    error={touched.country_input && errors.country_input}
                                                    label={localize('Country')}
                                                    placeholder={localize('Please select')}
                                                    list_items={residence_list}
                                                    value={values.country_input}
                                                    onChange={(e: TReactChangeEvent) => {
                                                        handleChange(e);
                                                        submitCountry({ country_input: e.target.value });
                                                    }}
                                                    use_text={true}
                                                    required
                                                />
                                            </div>
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                    ) : (
                        <Loading is_fullscreen={false} />
                    )}
                </div>
            )}
        </Formik>
    );
};

export default connect(({ client }: TRootStore) => ({
    fetchResidenceList: client.fetchResidenceList,
}))(CountrySelector);
