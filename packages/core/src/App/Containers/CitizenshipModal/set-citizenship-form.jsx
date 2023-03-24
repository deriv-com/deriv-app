import { Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Autocomplete, DesktopWrapper, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const SetCitizenshipForm = ({ class_prefix, errors, touched, setFieldTouched, setFieldValue, citizenship_list }) => (
    <div className={`${class_prefix}__residence-selection`}>
        <Field name='citizenship'>
            {({ field }) => (
                <React.Fragment>
                    <DesktopWrapper>
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            input_id='dt_core_set-citizenship-form_signup-citizenship-select'
                            className={`${class_prefix}__residence-field`}
                            type='text'
                            label={localize('Citizenship')}
                            error={touched.citizenship && errors.citizenship}
                            required
                            list_items={citizenship_list}
                            onItemSelection={({ value, text }) => setFieldValue('citizenship', value ? text : '', true)}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <SelectNative
                            placeholder={localize('Please select')}
                            label={localize('Citizenship')}
                            value={field.value}
                            list_items={citizenship_list}
                            error={touched.citizenship && errors.citizenship}
                            required
                            use_text
                            onChange={e => {
                                setFieldTouched('citizenship', true);
                                setFieldValue('citizenship', e.target.value, true);
                            }}
                            should_hide_disabled_options={false}
                        />
                    </MobileWrapper>
                </React.Fragment>
            )}
        </Field>
        <Text as='p' size='xxs' className='account-signup__subtext' color='less-prominent'>
            <Localize i18n_default_text='Select your citizenship/nationality as it appears on your passport or other government-issued ID.' />
        </Text>
    </div>
);

SetCitizenshipForm.propTypes = {
    class_prefix: PropTypes.string,
    citizenship_list: PropTypes.arrayOf(PropTypes.object),
    errors: PropTypes.object,
    setFieldTouched: PropTypes.func,
    setFieldValue: PropTypes.func,
    touched: PropTypes.object,
};

export default SetCitizenshipForm;
