import React from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv-com/ui';
import { ButtonGroup, Modal, SentEmailContent } from '../../../../components';
import { PlatformDetails } from '../../constants';
import CreateAccountButton from './CreateAccountButton';

type TAddAccountButtonsGroupProps = {
    password: string;
};

const AddAccountButtonsGroup = ({ password }: TAddAccountButtonsGroupProps) => {
    const { show } = Provider.useModal();
    const { getCFDState } = Provider.useCFDContext();
    const platform = getCFDState('platform') ?? PlatformDetails.dxtrade.platform;

    return (
        <ButtonGroup className='w-full'>
            <Button
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
            <CreateAccountButton buttonText='Add account' password={password} />;
        </ButtonGroup>
    );
};

export default AddAccountButtonsGroup;
