import React, { MouseEventHandler } from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import IcPOAError from '../../../../assets/poa/ic-poa-error.svg';
import POAStatus from '../POAStatus';

type TUnverified = {
    onClick: MouseEventHandler<HTMLButtonElement>;
};

export const Unverified = ({ onClick }: TUnverified) => (
    <POAStatus
        actionButton={<Button onClick={onClick}>Resubmit</Button>}
        icon={<IcPOAError width={128} />}
        title='We could not verify your proof of address'
    >
        <Text align='center' size='sm'>
            Please check your email for details.
        </Text>
    </POAStatus>
);
