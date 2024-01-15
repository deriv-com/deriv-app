import React, { useEffect } from 'react';
import { useAuthorize, useDxtradeAccountsList } from '@deriv/api';
import { TradingAppCardLoader } from '../../../../components/SkeletonLoader';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '../../flows/OtherCFDs/Dxtrade';
import './OtherCFDPlatformsList.scss';

const OtherCFDPlatformsList: React.FC = () => {
    const { fetchStatus } = useAuthorize();
    const { data, isFetchedAfterMount, refetch } = useDxtradeAccountsList();
    const hasDxtradeAccount = !!data?.length;

    useEffect(() => {
        if (fetchStatus === 'idle') {
            refetch();
        }
    }, [fetchStatus, refetch]);

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
