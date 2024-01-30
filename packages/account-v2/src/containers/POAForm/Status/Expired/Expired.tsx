import React, { MouseEventHandler } from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import IcPOAUpload from '../../../../assets/verification-status/ic-poa-upload.svg';
import POAStatus from '../POAStatus';

type TExpired = {
    onClick: MouseEventHandler<HTMLButtonElement>;
};

export const Expired = ({ onClick }: TExpired) => (
    <POAStatus
        actionButton={<Button onClick={onClick}>Resubmit</Button>}
        icon={<IcPOAUpload width={128} />}
        title='New proof of address is needed'
    >
        <Text align='center' size='sm'>
            Your document for proof of address is expired. <br />
            Please submit again.
        </Text>
    </POAStatus>
);
