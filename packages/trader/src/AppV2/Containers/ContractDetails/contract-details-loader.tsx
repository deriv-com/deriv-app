import React from 'react';
import { ContractCardLoader } from 'AppV2/Components/ContractCard';
import { Skeleton } from 'AppV2/Components/Skeleton';

const ContractDetailsLoader = () => {
    return (
        <div className='contract-details-loader'>
            <ContractCardLoader />
            <div className='skeleton-box__chart'>
                <Skeleton height='344px' />
            </div>
            <div className='skeleton-box__details'>
                <Skeleton width='136px' height='24px' />
                <div>
                    {Array.from(new Array(4)).map((_, idx) => {
                        return (
                            <div key={idx} className='skeleton-box__details-row'>
                                <Skeleton width='88px' height='22px' />
                                <Skeleton width='128px' height='22px' />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className='skeleton-box__details'>
                <Skeleton width='136px' height='24px' />
                <Skeleton paragraph={{ rows: 2 }} height='18px' />
            </div>
            <div className='skeleton-box__details'>
                <Skeleton width='136px' height='24px' />
                <div>
                    {Array.from(new Array(2)).map((_, idx) => {
                        return (
                            <div key={idx} className='skeleton-box__details-row'>
                                <Skeleton width='88px' height='18px' />
                                <div className='skeleton-box__details-column'>
                                    <Skeleton width='88px' height='22px' />
                                    {Array.from(new Array(idx === 0 ? 1 : 2)).map((_, idx) => (
                                        <Skeleton key={idx} width='72px' height='16px' />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ContractDetailsLoader;
