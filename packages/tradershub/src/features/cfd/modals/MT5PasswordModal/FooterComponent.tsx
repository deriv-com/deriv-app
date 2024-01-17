import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    useActiveTradingAccount,
    useCreateMT5Account,
    useMT5AccountsList,
    useTradingPlatformPasswordChange,
} from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { ButtonGroup, Modal, SentEmailContent } from '../../../../components';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password';
import { useSubmitHandler } from './useSubmitHandler';

type TAddAccountButtonsGroupProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    password: string;
    platform: TPlatforms.All;
    selectedJurisdiction?: string;
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

const TransferFundsButtonsGroup = () => {
    const history = useHistory();
    const { hide } = Provider.useModal();
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;

    if (isDemo) {
        return (
            <Button onClick={hide} size='lg'>
                OK
            </Button>
        );
    }
    return (
        <ButtonGroup className='justify-center w-full'>
            <Button onClick={hide} size='lg' variant='secondary'>
                Maybe later
            </Button>
            <Button
                onClick={() => {
                    hide();
                    history.push('/cashier/transfer');
                }}
                size='lg'
            >
                Transfer funds
            </Button>
        </ButtonGroup>
    );
};

type TCreateAccountButtonProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    password: string;
    selectedJurisdiction?: string;
};

const CreateAccountButton = ({ marketType, password, selectedJurisdiction }: TCreateAccountButtonProps) => {
    const submitHandler = useSubmitHandler({ marketType, password, selectedJurisdiction });
    const { isLoading: createMT5AccountLoading } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading } = useTradingPlatformPasswordChange();

    return (
        <Button
            disabled={
                !password || createMT5AccountLoading || tradingPlatformPasswordChangeLoading || !validPassword(password)
            }
            fullWidth
            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
            onClick={() => submitHandler}
            size='lg'
        >
            Create Deriv MT5 password
        </Button>
    );
};

type TFooterComponentProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    password: string;
    platform: TPlatforms.All;
    selectedJurisdiction?: string;
};

const FooterComponent = ({ marketType, password, platform, selectedJurisdiction }: TFooterComponentProps) => {
    const { data: mt5Accounts } = useMT5AccountsList();
    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const { isSuccess } = useCreateMT5Account();

    if (isSuccess) return <TransferFundsButtonsGroup />;

    if (hasMT5Account)
        return (
            <AddAccountButtonsGroup
                marketType={marketType}
                password={password}
                platform={platform}
                selectedJurisdiction={selectedJurisdiction}
            />
        );

    return (
        <CreateAccountButton marketType={marketType} password={password} selectedJurisdiction={selectedJurisdiction} />
    );
};
export default FooterComponent;
