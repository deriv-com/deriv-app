import React from 'react';
import { ButtonGroup, Modal, SentEmailContent } from '@/components';
import { useCFDContext, useModal } from '@/providers';
import { Button } from '@deriv-com/ui';
import { PlatformDetails } from '../../constants';
import DxtradeCreateAccountButton from '../DxtradePasswordModal/DxtradeCreateAccountButton';
import MT5CreateAccountButton from '../MT5PasswordModal/MT5CreateAccountButton';

type TAddAccountButtonsGroupProps = {
    password: string;
};

const AddAccountButtonsGroup = ({ password }: TAddAccountButtonsGroupProps) => {
    const { show } = useModal();
    const { cfdState } = useCFDContext();
    const { platform } = cfdState;

    return (
        <ButtonGroup className='w-full'>
            <Button
                color='black'
                isFullWidth
                onClick={() => {
                    show(
                        <Modal>
                            <Modal.Header title="We've sent you an email" />
                            <Modal.Content>
                                <SentEmailContent platform={platform} />
                            </Modal.Content>
                        </Modal>
                    );
                }}
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
