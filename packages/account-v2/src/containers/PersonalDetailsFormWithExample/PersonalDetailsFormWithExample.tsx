import React, { lazy, Suspense, useMemo } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { InferType } from 'yup';
import { Checkbox, InlineMessage, Loader, Text } from '@deriv-com/ui';
import { DatePicker } from '../../components/DatePicker';
import { FormInputField } from '../../components/FormFields';
import { getNameDOBValidationSchema } from '../../utils/personal-details-utils';

const ExampleImage = lazy(() => import('../../assets/proof-of-identity/personal-details-example.svg'));

type TPersonalDetailsFormWithExampleFormProps = InferType<ReturnType<typeof getNameDOBValidationSchema>>;

export const PersonalDetailsFormWithExample = () => {
    const formik = useFormikContext<TPersonalDetailsFormWithExampleFormProps>();

    if (!formik) {
        throw new Error('PersonalDetailsFormWithExample must be used within a Formik component');
    }

    const { errors, values } = formik;

    const { dateOfBirth, firstName, lastName } = values;

    const isDisabled = useMemo(() => {
        return (
            !firstName ||
            !lastName ||
            !dateOfBirth ||
            !!errors?.firstName ||
            !!errors?.lastName ||
            !!errors?.dateOfBirth
        );
    }, [firstName, lastName, dateOfBirth, errors.firstName, errors.lastName, errors.dateOfBirth]);

    return (
        <section className='p-16 outline outline-1 outline-system-light-active-background lg:mx-24 rounded-default'>
            <InlineMessage className='items-start mb-16' variant='warning'>
                <Text as='p' className='text-sm lg:text-default'>
                    To avoid delays, enter your <span className='font-bold'>name</span> and{' '}
                    <span className='font-bold'>date of birth</span> exactly as they appear on your identity document.
                </Text>
            </InlineMessage>
            <div className='grid grid-cols-2 gap-16'>
                <div className='flex flex-col gap-16'>
                    <FormInputField
                        isFullWidth
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                    />
                    <FormInputField
                        isFullWidth
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                    />
                    <Field name='dateOfBirth' type='input'>
                        {({ field, form, meta }: FieldProps<string>) => (
                            <DatePicker
                                {...field}
                                aria-label='Date of birth*'
                                errorMessage={meta.error}
                                isInvalid={meta.touched && !!meta.error}
                                label='Date of birth*'
                                onDateChange={(date: string | null) => {
                                    form.setFieldValue(field.name, date);
                                }}
                            />
                        )}
                    </Field>
                </div>
                <div>
                    <Text as='p' className='mt-2 mb-4' size='xs' weight='bold'>
                        Example:
                    </Text>
                    <Suspense fallback={<Loader isFullScreen={false} />}>
                        <ExampleImage />
                    </Suspense>
                </div>
            </div>
            <div>
                <Field name='detailsConfirmation' type='checkbox'>
                    {({ field, meta: { error, touched } }: FieldProps) => (
                        <Checkbox
                            {...field}
                            disabled={isDisabled}
                            error={Boolean(error && touched)}
                            id='detailsConfirmation'
                            label='I confirm that the name and date of birth above match my chosen identity document.'
                        />
                    )}
                </Field>
            </div>
        </section>
    );
};
