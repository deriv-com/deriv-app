import React, { ChangeEvent, ReactNode } from 'react';
import { TPlatforms } from '@/types';
import { validPassword } from '@/utils';
import { PlatformDetails } from '@cfd/constants';
import { useBreakpoint } from '@deriv/quill-design';
import { Button, PasswordInput, Text } from '@deriv-com/ui';

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
    const { isMobile } = useBreakpoint();

    const { title } = PlatformDetails[platform];
    return (
        <div className='inline-flex flex-col items-center w-full text-center gap-1200  rounded-400 bg-system-light-primary-background lg:w-[360px]'>
            {!isMobile && icon}
            <div className='flex flex-col items-center justify-center gap-1200 lg:gap-400'>
                <Text as='h1' weight='bold'>
                    Create a {title} password
                </Text>
                <Text align='center' size='sm'>
                    You can use this password for all your {title} accounts.
                </Text>
            </div>
            <PasswordInput label={`${title} password`} onChange={onPasswordChange} value={password} />
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
