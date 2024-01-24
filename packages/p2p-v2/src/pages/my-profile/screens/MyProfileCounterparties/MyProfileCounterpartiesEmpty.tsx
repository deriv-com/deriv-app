import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import EmptyCounterparties from '../../../../public/ic-empty-blocked-advertisers.svg';
import './MyProfileCounterpartiesEmpty.scss';

const MyProfileCounterpartiesEmpty = () => (
    <div className='p2p-v2-my-profile-counterparties-empty'>
        <EmptyCounterparties />
        <Text weight='bold'>No one to show here</Text>
    </div>
);
export default MyProfileCounterpartiesEmpty;
