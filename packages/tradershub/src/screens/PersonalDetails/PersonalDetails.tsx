import React, { lazy } from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { Input, Text } from '@deriv-com/ui';
import Actions from '../../flows/RealAccountSIgnup/SignupWizard/Actions';
import WizardScreenWrapper from '../../flows/RealAccountSIgnup/SignupWizard/WizardScreenWrapper';
import { ACTION_TYPES, useSignupWizardContext } from '../../providers/SignupWizardProvider/SignupWizardContext';

const ExampleImage = lazy(() => import('../../public/images/personal-details-example.svg'));

/**
 * @name PersonalDetails
 * @description The PersonalDetails component is used to display the personal details screen.
 * @example <PersonalDetails />
 * @returns {React.ReactNode}
 */
const PersonalDetails = () => {
    const { dispatch, state } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { firstName: values.firstName }, type: ACTION_TYPES.SET_PERSONAL_DETAILS });
    };

    const initialValues = {
        accountOpeningReason: '',
        dateOfBirth: '',
        firstName: state.firstName,
        lastName: state.lastName,
        phoneNumber: '',
        placeOfBirth: '',
        taxIdentificationNumber: '',
        taxResidence: '',
    };

    return (
        <WizardScreenWrapper heading='Complete your personal details'>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ handleBlur, handleChange, values }) => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='flex-1 overflow-y-auto p-1200'>
                            <p className='text-75'>
                                Any information you provide is confidential and will be used for verification purposes
                                only.
                            </p>
                            <Text as='p' weight='bold'>
                                Details
                            </Text>
                            <div className='flex justify-center outline outline-1 outline-system-light-active-background mx-800 gap-800 p-800 rounded-400'>
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
                            </div>
                            <div>
                                <Text as='p' className='my-800' weight='bold'>
                                    Additional information
                                </Text>
                                <div className='flex flex-col gap-1400'>
                                    <Input
                                        className='w-full text-body-sm'
                                        label='Phone number*'
                                        name='phoneNumber'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.dateOfBirth}
                                    />
                                    <Input
                                        className='w-full text-body-sm'
                                        label='Place of birth*'
                                        name='placeOfBirth'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.placeOfBirth}
                                    />
                                    <Input
                                        className='w-full text-body-sm'
                                        label='Tax residence'
                                        name='taxResidence'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.taxResidence}
                                    />
                                    <Input
                                        className='w-full text-body-sm'
                                        label='Tax identification number'
                                        name='taxIdentificationNumber'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.taxIdentificationNumber}
                                    />
                                    <Input
                                        className='w-full text-body-sm'
                                        label='Account opening reason*'
                                        name='accountOpeningReason'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.accountOpeningReason}
                                    />
                                </div>
                            </div>
                        </div>
                        <Actions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default PersonalDetails;
