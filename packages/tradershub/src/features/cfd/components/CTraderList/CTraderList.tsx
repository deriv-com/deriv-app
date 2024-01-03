import React, { FC } from 'react';
import { useCtraderAccountsList } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { PlatformDetails } from '../../constants';
import { AddedCTraderAccountsList, AvailableCTraderAccountsList } from '../../flows/CTrader';

const CTraderList: FC = () => {
    const { data } = useCtraderAccountsList();
    const hasCTraderAccount = !!data?.length;
    return (
        <div className='pb-1200'>
            <Text bold>{PlatformDetails.ctrader.title}</Text>

            <div className='grid grid-cols-3 gap-x-800 gap-y-2400 lg:grid-cols-1 lg:grid-rows-1'>
                {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
            </div>
        </div>
    );
};

export default CTraderList;
