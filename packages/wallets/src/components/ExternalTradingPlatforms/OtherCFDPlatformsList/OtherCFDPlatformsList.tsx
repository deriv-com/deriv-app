import React, { useEffect } from 'react';
import { useAuthorize, useDxtradeAccountsList, useInvalidateQuery } from '@deriv/api';
import { AddedDxtradeAccountsList } from '../AddedDxtradeAccountsList';
import { AvailableDxtradeAccountsList } from '../AvailableDxtradeAccountsList';
import './OtherCFDPlatformsList.scss';

const OtherCFDPlatformsList: React.FC = () => {
    const { isFetching } = useAuthorize();
    const { data } = useDxtradeAccountsList();
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
                {hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
