import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import EntryExitDetails from 'AppV2/Components/EntryExitDetails';

const ContractDetails = () => {
    return (
        <div className='contract-details'>
            <div className='placeholder'>
                <Text size='sm'>Contract Details</Text>
            </div>
            <div className='placeholder'>
                <Text size='sm'>How do I earn a payout?</Text>
            </div>
            <div className='placeholder'>
                <Text size='sm'>Contract card</Text>
            </div>
            <div className='placeholder'>
                <Text size='sm'>Chart placeholder</Text>
            </div>
            <div className='placeholder'>
                <Text size='sm'>Take profit</Text>
            </div>
            <div className='placeholder'>
                <Text size='sm'>Order details</Text>
            </div>
            <EntryExitDetails />
        </div>
    );
};

export default ContractDetails;
