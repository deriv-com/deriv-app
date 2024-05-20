import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import PayoutInfoModal from 'AppV2/Components/PayoutInfoModal';
import ChartPlaceholder from '../Chart';

const ContractDetails = () => {
    return (
        <div className='contract-details'>
            <div className='placeholder'>
                <Text size='sm'>Contract Details</Text>
            </div>
            <PayoutInfoModal />
            <div className='placeholder'>
                <Text size='sm'>Contract card</Text>
            </div>
            Take Profit
            <div className='placeholder'>
                <ChartPlaceholder />
            </div>
            <div className='placeholder'>
                <Text size='sm'>Take profit</Text>
            </div>
            <div className='placeholder'>
                <Text size='sm'>Order details</Text>
            </div>
            <div className='placeholder'>
                <Text size='sm'>Entry & exit details</Text>
            </div>
        </div>
    );
};

export default ContractDetails;
