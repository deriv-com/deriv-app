import React from 'react';
import { Skeleton } from 'AppV2/Components/Skeleton';

const TradeLoader = () => {
    return (
        <div className='trade-loader'>
            <div className='skeleton-box__trade-types'>
                {Array.from(new Array(6)).map((_, idx) => (
                    <Skeleton key={idx} width='88px' height='32px' />
                ))}
            </div>
            <div className='skeleton-box__market'>
                <Skeleton width='200px' height='42px' />
            </div>
            <div className='skeleton-box__trade-params'>
                <div className='skeleton-box__trade-params-row'>
                    <Skeleton width='96px' height='24px' />
                    <Skeleton width='96px' height='32px' />
                </div>
                <div className='skeleton-box__trade-params-column'>
                    {Array.from(new Array(3)).map((_, idx) => (
                        <Skeleton key={idx} height='56px' />
                    ))}
                </div>
            </div>
            <div className='skeleton-box__chart'>
                <Skeleton height='384px' />
            </div>
        </div>
    );
};

export default TradeLoader;
