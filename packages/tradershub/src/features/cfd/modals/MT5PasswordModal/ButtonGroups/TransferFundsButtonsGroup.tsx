import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { ButtonGroup } from '../../../../../components';

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
export default TransferFundsButtonsGroup;
