import React from 'react';
import { ButtonGroup } from '@/components';
import { useQueryParams } from '@/hooks';
import { useCFDContext } from '@/providers';
import { Button } from '@deriv-com/ui';
import { PlatformDetails } from '../../constants';
import DxtradeCreateAccountButton from '../DxtradePasswordModal/DxtradeCreateAccountButton';
import MT5CreateAccountButton from '../MT5PasswordModal/MT5CreateAccountButton';

type TAddAccountButtonsGroupProps = {
    password: string;
};

const AddAccountButtonsGroup = ({ password }: TAddAccountButtonsGroupProps) => {
    const { cfdState } = useCFDContext();
    const { platform } = cfdState;
    const { openModal } = useQueryParams();

    return (
        <ButtonGroup className='w-full'>
            <Button
                color='black'
                isFullWidth
                onClick={() => openModal('SentEmailContentModal')}
                size='lg'
                variant='outlined'
            >
                Forgot password?
            </Button>
            {platform === PlatformDetails.dxtrade.platform && (
                <DxtradeCreateAccountButton buttonText='Add account' password={password} />
            )}
            {platform === PlatformDetails.mt5.platform && (
                <MT5CreateAccountButton buttonText='Add account' password={password} />
            )}
        </ButtonGroup>
    );
};

export default AddAccountButtonsGroup;
