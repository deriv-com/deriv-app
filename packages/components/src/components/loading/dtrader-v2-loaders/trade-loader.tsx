import React from 'react';
import { Skeleton } from '@deriv-com/quill-ui';

const TradeLoader = () => {
    return (
        <div className='loading-dtrader-v2__trade' data-testid='dt_trade_loader'>
            <div className='skeleton-box__trade-types'>
                {[...new Array(6)].map((_, idx) => (
                    <Skeleton.Square key={idx} width={88} height={32} />
                ))}
            </div>
            <div className='skeleton-box__market'>
                <Skeleton.Square width={200} height={42} />
            </div>
            <div className='skeleton-box__trade-params'>
                <div className='skeleton-box__trade-params-row'>
                    <Skeleton.Square width={96} height={24} />
                    <Skeleton.Square width={96} height={32} />
                </div>
                <div className='skeleton-box__trade-params-column'>
                    {[...new Array(3)].map((_, idx) => (
                        <Skeleton.Square key={idx} height={56} />
                    ))}
                </div>
            </div>
            <div className='skeleton-box__chart'>
                <Skeleton.Square />
            </div>
        </div>
    );
};

export default TradeLoader;
