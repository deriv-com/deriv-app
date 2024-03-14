import React, { useEffect } from 'react';
import { useAuthorize, useDxtradeAccountsList, useInvalidateQuery } from '@deriv/api-v2';
import { TradingAppCardLoader } from '../../../../components/SkeletonLoader';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '../../flows/OtherCFDs/Dxtrade';
import './OtherCFDPlatformsList.scss';

const OtherCFDPlatformsList: React.FC = () => {
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
        <div className='wallets-other-cfd'>
            <div className='wallets-other-cfd__title'>
                <h1>Other CFD Platforms</h1>
            </div>
            <div className='wallets-other-cfd__content'>
                {!isFetchedAfterMount && <TradingAppCardLoader />}
                {isFetchedAfterMount &&
                    (hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />)}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
