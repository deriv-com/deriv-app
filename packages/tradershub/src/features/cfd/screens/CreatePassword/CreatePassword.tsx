import React, { ChangeEvent } from 'react';
import MT5PasswordIcon from '@/assets/svgs/ic-mt5-password.svg';
import { TPlatforms } from '@/types';
import { Category, PlatformDetails } from '@cfd/constants';
import { Modal, PasswordInput, Text, useDevice } from '@deriv-com/ui';
import MT5PasswordFooter from '../../modals/MT5PasswordModal/MT5PasswordFooter';

type TCreatePasswordProps = {
    isDemo: boolean;
    onPasswordChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    password: string;
    platform: TPlatforms.All;
};

/**
 * Component to create a password for the platform
 * @isDemo is the account demo or real
 * @param onPasswordChange
 * @param password
 * @param platform MT5 or Deriv X
 */
const CreatePassword = ({ isDemo, onPasswordChange, password, platform }: TCreatePasswordProps) => {
    const { isDesktop } = useDevice();

    const { title } = PlatformDetails[platform];
    return (
        <React.Fragment>
            <Modal.Header>
                <Text weight='bold'>{`Create a ${isDemo ? Category.DEMO : Category.REAL} ${
                    PlatformDetails.mt5.title
                } account`}</Text>
            </Modal.Header>
            <Modal.Body>
                <div className='inline-flex flex-col items-center w-full gap-24 rounded-default bg-system-light-primary-background lg:w-[360px]'>
                    {isDesktop && <MT5PasswordIcon />}
                    <div className='flex flex-col items-center justify-center text-center lg:gap-8'>
                        <Text weight='bold'>Create a {title} password</Text>
                        <Text size='sm'>You can use this password for all your {title} accounts.</Text>
                    </div>
                    <PasswordInput
                        isFullWidth
                        label={`${title} password`}
                        onChange={onPasswordChange}
                        value={password}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <MT5PasswordFooter password={password} />
            </Modal.Footer>
        </React.Fragment>
    );
};

export default CreatePassword;
