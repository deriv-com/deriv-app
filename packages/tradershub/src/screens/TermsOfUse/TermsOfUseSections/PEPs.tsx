import React, { Fragment } from 'react';
import { Text } from '@deriv-com/ui';
import PEPConfirmation from './PEPConfirmation';

const PEPs = () => (
    <Fragment>
        <Text size='sm' weight='bold'>
            Real accounts are not available to politically exposed persons (PEPs).
        </Text>
        <Text size='sm'>
            A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates
            and family members of a PEP are also considered to be PEPs.
        </Text>
        <PEPConfirmation />
    </Fragment>
);

export default PEPs;
