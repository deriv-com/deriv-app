import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import { useMT5AccountHandler, useQueryParams } from '@/hooks';
import { validPassword } from '@/utils';
import { useTradingPlatformPasswordChange } from '@deriv/api-v2';
import { Button, Modal, PasswordInput, Text } from '@deriv-com/ui';
import { CFDPlatforms } from '../../constants';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };

const MT5ChangePassword = () => {
    const { isLoading: tradingPlatformPasswordChangeLoading, mutateAsync: tradingPasswordChange } =
        useTradingPlatformPasswordChange();

    const { handleSubmit: handleSubmit2, createMT5AccountStatus } = useMT5AccountHandler();
    const { openModal } = useQueryParams();

    const onChangeButtonClickHandler = async (values: TFormInitialValues) => {
        const newPW = values.newPassword;
        await tradingPasswordChange({
            new_password: values.newPassword,
            old_password: values.currentPassword,
            platform: CFDPlatforms.MT5,
        }).then(() => handleSubmit2(newPW)); // after change password, trigger account creation
    };

    useEffect(() => {
        if (createMT5AccountStatus === 'success') openModal('MT5SuccessModal');
    }, [createMT5AccountStatus, openModal]);

    return (
        <React.Fragment>
            <Formik initialValues={initialValues} onSubmit={onChangeButtonClickHandler}>
                {({ handleChange, handleSubmit, values }) => (
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body className='inline-flex flex-col items-center w-full gap-24 rounded-default bg-system-light-primary-background lg:p-24 lg:w-[525px]'>
                            <div className='flex flex-col items-center justify-center text-center lg:gap-8'>
                                <Text size='sm'>
                                    To enhance your MT5 account security we have upgraded our password policy. Please
                                    update your password accordingly.
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
                        </Modal.Body>
                        <Modal.Footer>
                            <Button color='black' isLoading={tradingPlatformPasswordChangeLoading} variant='outlined'>
                                Forgot password
                            </Button>
                            <Button
                                disabled={
                                    !values.newPassword ||
                                    tradingPlatformPasswordChangeLoading ||
                                    !validPassword(values.newPassword)
                                }
                                isLoading={tradingPlatformPasswordChangeLoading}
                            >
                                Change my password
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </React.Fragment>
    );
};

export default MT5ChangePassword;
