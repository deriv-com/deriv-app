import React from 'react';
import { Form, Formik } from 'formik';
import { useTradingPlatformInvestorPasswordChange } from '@deriv/api-v2';
import { Button, PasswordInput, Text } from '@deriv-com/ui';
import { CFDPlatforms } from '../../constants';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };

const MT5ChangePassword = () => {
    const {
        // error: changeInvestorPasswordError,
        mutateAsync: changeInvestorPassword,
        // status: changeInvestorPasswordStatus,
    } = useTradingPlatformInvestorPasswordChange();

    const onChangeButtonClickHandler = async (values: TFormInitialValues) => {
        await changeInvestorPassword({
            account_id: 'mt5AccountId',
            new_password: values.newPassword,
            old_password: values.currentPassword,
            platform: CFDPlatforms.MT5,
        });
    };

    return (
        <Formik initialValues={initialValues} onSubmit={onChangeButtonClickHandler}>
            {({ handleChange, handleSubmit, values }) => (
                <Form onSubmit={handleSubmit}>
                    <div className='inline-flex flex-col items-center w-full gap-24 rounded-default bg-system-light-primary-background lg:w-[525px]'>
                        <div className='flex flex-col items-center justify-center text-center lg:gap-8'>
                            <Text weight='bold'>Deriv MT5 latest password requirements</Text>
                            <Text size='sm'>
                                To enhance your MT5 account security we have upgraded our password policy. Please update
                                your password accordingly.
                            </Text>
                        </div>
                        <PasswordInput
                            isFullWidth
                            label='current password'
                            name='currentPassword'
                            onChange={handleChange}
                            value={values.currentPassword}
                        />
                        <PasswordInput
                            isFullWidth
                            label='new password'
                            name='newPassword'
                            onChange={handleChange}
                            value={values.newPassword}
                        />
                        <ol className='w-full list-disc list-inside gap-y-8'>
                            <Text as='li' size='xs'>
                                8 to 16 characters
                            </Text>

                            <Text as='li' size='xs'>
                                A special character such as ( _ @ ? ! / # )
                            </Text>

                            <Text as='li' size='xs'>
                                An uppercase letter
                            </Text>

                            <Text as='li' size='xs'>
                                A lowercase letter
                            </Text>

                            <Text as='li' size='xs'>
                                A number
                            </Text>
                        </ol>

                        <div className='flex justify-end w-full gap-x-8'>
                            <Button
                                color='black'
                                // disabled={!password || isLoading || !validPassword(password)}
                                // isLoading={isLoading}
                                // onClick={onPrimaryClick}
                                variant='outlined'
                            >
                                Forgot password
                            </Button>
                            <Button
                            // disabled={!password || isLoading || !validPassword(password)}
                            // isLoading={isLoading}
                            // onClick={onPrimaryClick}
                            >
                                Change my password
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default MT5ChangePassword;
