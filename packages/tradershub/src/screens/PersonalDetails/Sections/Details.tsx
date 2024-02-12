import React, { Fragment, lazy, Suspense } from 'react';
import { useFormikContext } from 'formik';
import { useBreakpoint } from '@deriv/quill-design';
import { InlineMessage, Input, Loader, Text } from '@deriv-com/ui';
import DetailsConfirmation from './DetailsConfirmation';

const ExampleImage = lazy(() => import('@/assets/svgs/personal-details-example.svg'));

const Details = () => {
    const isMobile = useBreakpoint();
    const { errors, handleBlur, handleChange, touched, values } = useFormikContext<{
        confirmation: boolean;
        dateOfBirth: string;
        firstName: string;
        lastName: string;
    }>();

    return (
        <Fragment>
            <Text as='p' className='my-800' weight='bold'>
                Details
            </Text>
            <div className='outline outline-1 outline-system-light-active-background md:mx-800 p-800 rounded-400'>
                <InlineMessage className='items-start mb-800' variant='warning'>
                    <Text size={isMobile ? 'sm' : 'md'}>
                        To avoid delays, enter your <span className='font-bold'>name</span> and{' '}
                        <span className='font-bold'>date of birth</span> exactly as they appear on your identity
                        document.
                    </Text>
                </InlineMessage>
                <div className='flex flex-col-reverse justify-center md:flex-row gap-800'>
                    <div className='flex flex-col md:w-1/2 gap-1000'>
                        <Input
                            className='text-body-sm'
                            error={Boolean(errors.firstName && touched.firstName)}
                            isFullWidth
                            label='First name*'
                            message={
                                errors.firstName && touched.firstName
                                    ? errors.firstName
                                    : 'Your first name as in your identity document'
                            }
                            name='firstName'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                        />
                        <Input
                            className='text-body-sm'
                            error={Boolean(errors.lastName && touched.lastName)}
                            isFullWidth
                            label='Last name*'
                            message={
                                errors.lastName && touched.lastName
                                    ? errors.lastName
                                    : 'Your last name as in your identity document'
                            }
                            name='lastName'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                        />
                        {/** Add date picker when available from deriv/ui */}
                        <Input
                            className='text-body-sm'
                            error={Boolean(errors.dateOfBirth && touched.dateOfBirth)}
                            isFullWidth
                            label='Date of birth*'
                            message={
                                errors.dateOfBirth && touched.dateOfBirth
                                    ? errors.dateOfBirth
                                    : 'Your last name as in your identity document'
                            }
                            name='dateOfBirth'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.dateOfBirth}
                        />
                    </div>
                    <div className='relative text-center md:w-1/2'>
                        <Text as='p' className='mt-2 mb-4' size='xs' weight='bold'>
                            Example:
                        </Text>
                        <Suspense fallback={<Loader />}>
                            <ExampleImage />
                        </Suspense>
                    </div>
                </div>
                <div className='mt-800'>
                    <DetailsConfirmation />
                </div>
            </div>
        </Fragment>
    );
};

export default Details;
