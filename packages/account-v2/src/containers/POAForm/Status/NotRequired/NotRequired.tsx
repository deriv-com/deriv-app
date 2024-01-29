import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import IcPOAVerified from '../../../../assets/poa/ic-poa-verified.svg';
import POAStatus from '../POAStatus';

export const NotRequired = () => (
    <POAStatus icon={<IcPOAVerified width={128} />} title='Proof of address verification not required'>
        <Text align='center' size='sm'>
            Your account does not need address verification at this time. We will inform you if address verification is
            required in the future.
        </Text>
    </POAStatus>
);
