import React, { useEffect, useState } from 'react';
import { useMT5AccountHandler, useQueryParams } from '@/hooks';
import { validPassword } from '@/utils';
import { useTradingPlatformPasswordChange } from '@deriv/api-v2';
import { Button, Modal, PasswordInput, Text } from '@deriv-com/ui';
import { CFDPlatforms } from '../../constants';

const MT5ChangePassword = () => {
    const { isLoading: tradingPlatformPasswordChangeLoading, mutateAsync: tradingPasswordChange } =
        useTradingPlatformPasswordChange();
    const { handleSubmit: createMT5Account, createMT5AccountStatus } = useMT5AccountHandler();
    const { openModal } = useQueryParams();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const changePasswordAndCreateAccountHandler = async () => {
        await tradingPasswordChange({
            new_password: newPassword,
            old_password: currentPassword,
            platform: CFDPlatforms.MT5,
        }).then(() => createMT5Account(newPassword));
    };

    useEffect(() => {
        if (createMT5AccountStatus === 'success') openModal('MT5SuccessModal');
    }, [createMT5AccountStatus, openModal]);

    const passwordValidationChecklist = [
        '8 to 16 characters',
        'A special character such as ( _ @ ? ! / # )',
        'An uppercase letter',
        'A lowercase letter',
        'A number',
    ];

    return (
        <React.Fragment>
            <Modal.Body className='lg:p-24 lg:w-[525px]'>
                <Text size='sm'>
                    To enhance your MT5 account security we have upgraded our password policy. Please update your
                    password accordingly.
                </Text>
                <PasswordInput
                    isFullWidth
                    label='Current password'
                    name='currentPassword'
                    onChange={e => setCurrentPassword(e.target.value)}
                    value={currentPassword}
                />
                <PasswordInput
                    isFullWidth
                    label='New password'
                    name='newPassword'
                    onChange={e => setNewPassword(e.target.value)}
                    value={newPassword}
                />
                <ol className='w-full list-disc list-inside space-y-8'>
                    {passwordValidationChecklist.map(item => (
                        <Text as='li' key={item} size='xs'>
                            {item}
                        </Text>
                    ))}
                </ol>
            </Modal.Body>
            <Modal.Footer>
                <Button color='black' isLoading={tradingPlatformPasswordChangeLoading} variant='outlined'>
                    Forgot password
                </Button>
                <Button
                    disabled={!newPassword || tradingPlatformPasswordChangeLoading || !validPassword(newPassword)}
                    isLoading={tradingPlatformPasswordChangeLoading}
                    onClick={() => changePasswordAndCreateAccountHandler()}
                >
                    Change my password
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
};

export default MT5ChangePassword;
