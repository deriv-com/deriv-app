import React, { ChangeEvent } from 'react';
import { useFormikContext } from 'formik';
import { validPassword } from '@/utils';
import { Button, PasswordInput, Text } from '@deriv-com/ui';
import { TSignupFormValues } from '../SignupWrapper/SignupWrapper';

const PasswordSettingModal = () => {
    const { values, setFieldValue } = useFormikContext<TSignupFormValues>();

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFieldValue('password', e.target.value);
    };

    return (
        <div className='h-full rounded-default max-w-[328px] lg:max-w-[440px] bg-system-light-primary-background'>
            <div className='flex flex-col p-16 space-y-16 lg:space-y-24 lg:p-24'>
                <Text align='center' weight='bold'>
                    Keep your account secure with a password
                </Text>
                <PasswordInput
                    isFullWidth
                    label='Create a password'
                    onChange={onPasswordChange}
                    value={values.password}
                />
                <Text align='center' size='xs'>
                    Strong passwords contain at least 8 characters. combine uppercase and lowercase letters, numbers,
                    and symbols.
                </Text>
                <Button
                    className='w-full lg:self-end lg:w-fit'
                    disabled={!validPassword(values.password)}
                    type='submit'
                >
                    Start trading
                </Button>
            </div>
        </div>
    );
};

export default PasswordSettingModal;
