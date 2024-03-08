import React from 'react';
import { useHistory } from 'react-router-dom';
import { useModal } from '@/providers';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Button } from '@deriv-com/ui';
import { ButtonGroup } from '../../../../components';

const SuccessButtonGroup = () => {
    const { hide } = useModal();
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;
    const history = useHistory();

    if (isDemo) {
        return (
            <Button onClick={hide} size='lg'>
                OK
            </Button>
        );
    }
    return (
        <ButtonGroup className='justify-center w-full'>
            <Button color='black' onClick={() => hide()} size='lg' variant='outlined'>
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

export default SuccessButtonGroup;
