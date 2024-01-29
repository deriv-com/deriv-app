import React from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { ButtonGroup, Modal, SentEmailContent } from '../../../../../components';
import { CFDPlatforms } from '../../../constants';
import CreateAccountButton from './CreateAccountButton';

type TProps = {
    password: string;
};

const AddAccountButtonsGroup = ({ password }: TProps) => {
    const { show } = Provider.useModal();
    const { getCFDState } = Provider.useCFDContext();
    const platform = getCFDState('platform') ?? CFDPlatforms.MT5;

    return (
        <ButtonGroup className='w-full'>
            <Button
                fullWidth
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
                variant='secondary'
            >
                Forgot password?
            </Button>
            <CreateAccountButton buttonText='Add account' password={password} />;
        </ButtonGroup>
    );
};

export default AddAccountButtonsGroup;
