import React, { Fragment } from 'react';
import { Field, FieldProps } from 'formik';
import { Checkbox, Text } from '@deriv-com/ui';

const PEPConfirmation = () => (
    <Fragment>
        <Field name='pepConfirmation' type='checkbox'>
            {({ field, meta }: FieldProps) => (
                <Checkbox
                    label='I am not a PEP and never have been a PEP.'
                    {...field}
                    error={Boolean(meta.touched && meta.error)}
                    id='pepConfirmation'
                />
            )}
        </Field>
        <Field name='termsAndCondition' type='checkbox'>
            {({ field, meta }: FieldProps) => (
                <Checkbox
                    label={
                        <Text color={meta.error && meta.touched ? 'error' : 'general'} size='sm'>
                            I agree to the{' '}
                            <a
                                className='font-bold text-brand-coral hover:underline'
                                href='/terms-and-conditions'
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                terms and conditions.
                            </a>
                        </Text>
                    }
                    {...field}
                    error={Boolean(meta.touched && meta.error)}
                    id='termsAndCondition'
                />
            )}
        </Field>
    </Fragment>
);

export default PEPConfirmation;
