import React from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { ButtonGroup, Modal, SentEmailContent } from '../../../../../components';
import { useSubmitHandler } from '../useSubmitHandler';

type TProps = {
    password: string;
};

const AddAccountButtonsGroup = ({ password }: TProps) => {
    const { show } = Provider.useModal();
    const { getCFDState } = Provider.useCFDContext();
    const createMT5AccountLoading = getCFDState('createMT5AccountLoading');
    const tradingPlatformPasswordChangeLoading = getCFDState('tradingPlatformPasswordChangeLoading');

    const platform = getCFDState('platform') ?? 'mt5';
    const submitHandler = useSubmitHandler({ password });
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
            <Button
                disabled={!password || createMT5AccountLoading || tradingPlatformPasswordChangeLoading}
                fullWidth
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onClick={() => submitHandler}
                size='lg'
            >
                Add account
            </Button>
        </ButtonGroup>
    );
};

export default AddAccountButtonsGroup;
