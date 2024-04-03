import React from 'react';
import { useQueryParams } from '@/hooks';
import { Button, Text } from '@deriv-com/ui';

/**
 * `GetADerivAccountBanner` is a functional component that displays a banner message
 * informing the user that they need a Deriv account to create a CFD account.
 * It includes a button that leads the user to a modal where they can create a Deriv account.
 *
 * @returns {React.ReactElement} A `div` element containing the banner message and the button.
 */
const GetADerivAccountBanner = () => {
    const { openModal } = useQueryParams();
    return (
        <div className='flex items-center justify-center w-full gap-16 p-16 rounded-xs bg-system-light-secondary-background'>
            <Text weight='bold'>You need a Deriv account to create a CFD account.</Text>
            <Button className='rounded-xs' onClick={() => openModal('RealAccountCreation')}>
                Get a Deriv account
            </Button>
        </div>
    );
};

export default GetADerivAccountBanner;
