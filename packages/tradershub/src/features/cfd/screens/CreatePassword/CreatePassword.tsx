import React, { ChangeEvent } from 'react';
import MT5PasswordIcon from '@/assets/svgs/ic-mt5-password.svg';
import { useCFDContext } from '@/providers';
import { Category, CFDPlatforms, PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Modal, PasswordInput, Text } from '@deriv-com/ui';
import MT5PasswordFooter from '../../modals/MT5PasswordModal/MT5PasswordFooter';

type TCreatePasswordProps = {
    onPasswordChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    password: string;
};

/**
 * Component to create a password for the platform
 * @param onPasswordChange
 * @param password
 */
const CreatePassword = ({ onPasswordChange, password }: TCreatePasswordProps) => {
    const { data: activeTrading } = useActiveTradingAccount();
    const { cfdState } = useCFDContext();

    const isDemo = activeTrading?.is_virtual;
    const { platform = CFDPlatforms.MT5 } = cfdState;
    const { title } = PlatformDetails[platform];

    return (
        <React.Fragment>
            <Modal.Header>
                <Text weight='bold'>{`Create a ${isDemo ? Category.DEMO : Category.REAL} ${
                    PlatformDetails.mt5.title
                } account`}</Text>
            </Modal.Header>
            <Modal.Body>
                <div className='hidden lg:block'>
                    <MT5PasswordIcon />
                </div>
                <div className='flex flex-col items-center justify-center text-center lg:gap-8'>
                    <Text weight='bold'>Create a {title} password</Text>
                    <Text size='sm'>You can use this password for all your {title} accounts.</Text>
                </div>
                <PasswordInput isFullWidth label={`${title} password`} onChange={onPasswordChange} value={password} />
            </Modal.Body>
            <Modal.Footer>
                <MT5PasswordFooter password={password} />
            </Modal.Footer>
        </React.Fragment>
    );
};

export default CreatePassword;
