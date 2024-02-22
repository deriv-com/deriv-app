import React, { ChangeEvent, ReactNode } from 'react';
import { TPlatforms } from '@/types';
import { validPassword } from '@/utils';
import { PlatformDetails } from '@cfd/constants';
import { Button, PasswordInput, Text, useDevice } from '@deriv-com/ui';

type TCreatePasswordProps = {
    icon: ReactNode;
    isLoading?: boolean;
    onPasswordChange?: (e: ChangeEvent<HTMLInputElement>) => void;
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
const CreatePassword = ({
    icon,
    isLoading,
    onPasswordChange,
    onPrimaryClick,
    password,
    platform,
}: TCreatePasswordProps) => {
    const { isDesktop } = useDevice();

    const { title } = PlatformDetails[platform];
    return (
        <div className='inline-flex flex-col items-center w-full gap-24 rounded-default bg-system-light-primary-background lg:w-[360px]'>
            {isDesktop && icon}
            <div className='flex flex-col items-center justify-center text-center lg:gap-8'>
                <Text weight='bold'>Create a {title} password</Text>
                <Text size='sm'>You can use this password for all your {title} accounts.</Text>
            </div>
            <PasswordInput isFullWidth label={`${title} password`} onChange={onPasswordChange} value={password} />
            {isDesktop && (
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
