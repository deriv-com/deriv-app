import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '../../flows/OtherCFDs/Dxtrade';
import './OtherCFDPlatformsList.scss';

const OtherCFDPlatformsList: React.FC = () => {
    const { data } = useDxtradeAccountsList();
    const hasDxtradeAccount = !!data?.length;

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
