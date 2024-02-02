import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { ButtonGroup } from '../../../../../components';

const SuccessButtonGroup = () => {
    const { hide } = Provider.useModal();
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
            <Button className='rounded-200' colorStyle='black' onClick={() => hide()} size='lg' variant='secondary'>
                Maybe later
            </Button>
            <Button
                className='rounded-200'
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
