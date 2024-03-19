import React, { ChangeEvent } from 'react';
import MT5PasswordIcon from '@/assets/svgs/ic-mt5-password.svg';
import { useCFDContext } from '@/providers';
import { Category, PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Modal, PasswordInput, Text, useDevice } from '@deriv-com/ui';
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
    const { isDesktop } = useDevice();
    const { data: activeTrading } = useActiveTradingAccount();
    const { cfdState } = useCFDContext();

    const isDemo = activeTrading?.is_virtual;
    const { platform } = cfdState;
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
