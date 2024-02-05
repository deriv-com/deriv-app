import React, { lazy } from 'react';
import { useFormikContext } from 'formik';
import { InlineMessage, Input, Text } from '@deriv-com/ui';

const ExampleImage = lazy(() => import('../../../public/images/personal-details-example.svg'));

const Details = () => {
    const { handleBlur, handleChange, values } = useFormikContext<{
        dateOfBirth: string;
        firstName: string;
        lastName: string;
    }>();
    return (
        <>
            <Text as='p' className='my-800' weight='bold'>
                Details
            </Text>
            <div className='outline outline-1 outline-system-light-active-background mx-800 p-800 rounded-400 pb-2000'>
                <InlineMessage className='items-start mb-800' variant='warning'>
                    <Text>
                        To avoid delays, enter your <span className='font-bold'>name</span> and{' '}
                        <span className='font-bold'>date of birth</span> exactly as they appear on your identity
                        document.
                    </Text>
                </InlineMessage>
                <div className='flex justify-center gap-800'>
                    <div className='flex flex-col w-1/2 gap-2000'>
                        <Input
                            className='w-full text-body-md'
                            label='First name*'
                            message='Your first name as in your identity document.'
                            name='firstName'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                            value={values.firstName}
                        />
                        <Input
                            className='w-full text-body-sm'
                            label='Last name*'
                            message='Your last name as in your identity document.'
                            name='lastName'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                            value={values.lastName}
                        />
                        {/** Add date picker when available from deriv/ui */}
                        <Input
                            className='w-full text-body-sm'
                            label='Date of birth*'
                            message='Your last name as in your identity document.'
                            name='dateOfBirth'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                            value={values.dateOfBirth}
                        />
                    </div>
                    <div className='w-1/2 text-center'>
                        <Text as='p' className='mt-2 mb-4' size='xs' weight='bold'>
                            Example:
                        </Text>
                        <ExampleImage />
                    </div>
                    {/** Add confirmation checkbox for the confirmation when available in deriv/ui */}
                </div>
            </div>
        </>
    );
};

export default Details;
