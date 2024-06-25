import React from 'react';
import { Skeleton, VARIANT } from 'AppV2/Components/Skeleton';

type TPositionsLoaderProps = {
    isClosedTab?: boolean;
};

const PositionsLoader = ({ isClosedTab }: TPositionsLoaderProps) => {
    return (
        <div className='positions-loader'>
            <div className='skeleton-filters'>
                {Array.from(new Array(isClosedTab ? 2 : 1)).map((_, idx) => {
                    return <Skeleton key={idx} width='144px' height='32px' />;
                })}
            </div>
            <div className='skeleton-pnl-or-date'>
                {Array.from(new Array(isClosedTab ? 1 : 2)).map((_, idx) => {
                    return <Skeleton key={idx} width={idx === 0 ? '112px' : '68px'} height='22px' />;
                })}
            </div>
            <div className='skeleton-contract-card-list'>
                {Array.from(new Array(7)).map((_, idx) => {
                    return (
                        <div key={idx} className='skeleton-contract-card'>
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
                })}
            </div>
        </div>
    );
};

export default PositionsLoader;
