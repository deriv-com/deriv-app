import React, { FC } from 'react';
import { Button, Text, TextField, useBreakpoint } from '@deriv/quill-design';
import { TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password';
import { PlatformDetails } from '../../constants';

type TProps = {
    icon: React.ReactNode;
    isLoading?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    password: string;
    platform: TPlatforms.All;
};

/**
 * Component to create a password for the platform
 * @param icon
 * @param isLoading
 * @param onPasswordChange
 * @param onPrimaryClick
 * @param password
 * @param platform MT5 or Deriv X
 * @returns
 */
const CreatePassword: FC<TProps> = ({ icon, isLoading, onPasswordChange, onPrimaryClick, password, platform }) => {
    const { isMobile } = useBreakpoint();

    const title = PlatformDetails[platform].title;
    return (
        <div className='inline-flex flex-col items-center w-full text-center gap-1200 p-1600 rounded-400 bg-system-light-primary-background lg:w-[400px]'>
            {!isMobile && icon}
            <div className='flex flex-col justify-center gap-1200 lg:gap-400'>
                <Text bold>Create a {title} password</Text>
                <Text size='sm'>You can use this password for all your {title} accounts.</Text>
            </div>

            <TextField onChange={onPasswordChange} placeholder={`${title} password`} value={password} />
            {!isMobile && (
                <Button
                    disabled={!password || isLoading || !validPassword(password)}
                    isLoading={isLoading}
                    onClick={onPrimaryClick}
                    size='lg'
                >
                    {`Create ${title} password`}
                </Button>
            )}
        </div>
    );
};

export default CreatePassword;
