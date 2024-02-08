import React from 'react';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv-com/ui';
import { useSignupWizardContext } from '../../providers/SignupWizardProvider';
import { Dialog } from '../Dialog';

/**
 * `GetADerivAccountDialog`  is opened when user tried to create a CFD account without a Deriv account
 * It includes a button that leads the user to a modal where they can create a Deriv account.
 *
 * @returns {React.ReactElement} A `<Dialog>` component containing the dialog message and action button.
 */
const GetADerivAccountDialog = () => {
    const { hide } = Provider.useModal();
    const { setIsWizardOpen } = useSignupWizardContext();

    return (
        <Dialog className='lg:w-[440px]'>
            <Dialog.Header heading='h5' hideCloseButton title="You'll need a Deriv account" />
            <Dialog.Content>
                <Text size='sm'>A Deriv account will allow you to fund (and withdraw from) your CFDs account(s). </Text>
            </Dialog.Content>
            <Dialog.Action align='right'>
                <Button onClick={hide} variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={() => setIsWizardOpen(true)}>Add a Deriv account</Button>
            </Dialog.Action>
        </Dialog>
    );
};

export default GetADerivAccountDialog;
