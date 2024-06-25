import React from 'react';
import { Skeleton, VARIANT } from '../Skeleton';

const ContractCardLoader = () => (
    <div className='contract-card-loader'>
        <div className='details'>
            <Skeleton variant={VARIANT.ICON} />
            <div className='title'>
                <Skeleton width='88px' height='18px' />
                <Skeleton width='128px' height='18px' />
            </div>
            <Skeleton className='stake' width='56px' height='18px' />
        </div>
        <div className='status-and-profit'>
            <Skeleton width='96px' height='24px' />
            <Skeleton width='72px' height='22px' />
        </div>
    </div>
);

export default ContractCardLoader;
