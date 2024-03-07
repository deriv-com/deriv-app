import React from 'react';
import { DerivLightIcEmptyBlockedAdvertisersIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './MyProfileCounterpartiesEmpty.scss';

const MyProfileCounterpartiesEmpty = () => (
    <div className='p2p-v2-my-profile-counterparties-empty'>
        <DerivLightIcEmptyBlockedAdvertisersIcon height='12.8rem' width='12.8rem' />
        <Text weight='bold'>No one to show here</Text>
    </div>
);
export default MyProfileCounterpartiesEmpty;
