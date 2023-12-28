import React, { FC, useEffect } from 'react';
import { useAuthorize, useDxtradeAccountsList, useInvalidateQuery } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '../../flows/OtherCFDs/Dxtrade';

const OtherCFDPlatformsList: FC = () => {
    const { isFetching } = useAuthorize();
    const { data, isFetchedAfterMount } = useDxtradeAccountsList();
    const invalidate = useInvalidateQuery();
    const hasDxtradeAccount = !!data?.length;

    useEffect(() => {
        if (!isFetching) {
            invalidate('trading_platform_accounts');
        }
    }, [invalidate, isFetching]);

    return (
        <div className='pb-1200'>
            <Text bold>Other CFD Platforms</Text>
            <div className='grid grid-cols-3 gap-x-800 gap-y-2400 md:grid-cols-1 md:grid-rows-1'>
                {isFetchedAfterMount &&
                    (hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />)}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
