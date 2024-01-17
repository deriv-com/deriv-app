import React from 'react';
import { useCreateMT5Account, useTradingPlatformPasswordChange } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { ButtonGroup, Modal, SentEmailContent } from '../../../../components';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { TTM5FilterLandingCompany } from '../../constants';
import { useSubmitHandler } from './useSubmitHandler';

type TAddAccountButtonsGroupProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    password: string;
    platform: TPlatforms.All;
    selectedJurisdiction: TTM5FilterLandingCompany;
};

const AddAccountButtonsGroup = ({
    marketType,
    password,
    platform,
    selectedJurisdiction,
}: TAddAccountButtonsGroupProps) => {
    const { show } = Provider.useModal();
    const { isLoading: createMT5AccountLoading } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading } = useTradingPlatformPasswordChange();
    const submitHandler = useSubmitHandler({ marketType, password, selectedJurisdiction });
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
