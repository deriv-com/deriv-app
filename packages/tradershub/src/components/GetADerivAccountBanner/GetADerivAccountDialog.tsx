import React from 'react';
import { Button, Text } from '@deriv/quill-design';
import { Dialog } from '../Dialog';

/**
 * `GetADerivAccountDialog`  is opened when user tried to create a CFD account without a Deriv account
 * It includes a button that leads the user to a modal where they can create a Deriv account.
 *
 * @returns {React.ReactElement} A `<Dialog>` component containing the dialog message and action button.
 */
const GetADerivAccountDialog = () => {
    return (
        <Dialog className='lg:w-[440px]'>
            <Dialog.Header heading='h6' hideCloseButton title="You'll need a Deriv account" />
            <Dialog.Content>
                <Text size='sm'>A Deriv account will allow you to fund (and withdraw from) your MT5 account(s). </Text>
            </Dialog.Content>
            <Dialog.Action align='right'>
                <Button className='rounded-200 py-800 px-500' colorStyle='black' size='md' variant='secondary'>
                    Cancel
                </Button>
                <Button className='rounded-200 py-800 px-500' colorStyle='coral' size='md' variant='primary'>
                    Add a Deriv account
                </Button>
            </Dialog.Action>
        </Dialog>
    );
};

export default GetADerivAccountDialog;
