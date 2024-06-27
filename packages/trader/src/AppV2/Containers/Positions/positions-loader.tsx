import React from 'react';
import { Skeleton } from 'AppV2/Components/Skeleton';

type TPositionsLoaderProps = {
    isClosedTab?: boolean;
};

const PositionsLoader = ({ isClosedTab }: TPositionsLoaderProps) => {
    return (
        <div className='positions-loader'>
            <div className='skeleton-box__filters'>
                {Array.from(new Array(isClosedTab ? 2 : 1)).map((_, idx) => {
                    return <Skeleton key={idx} width='144px' height='32px' />;
                })}
            </div>
            <div className='skeleton-box__total-pnl-or-date'>
                {Array.from(new Array(isClosedTab ? 1 : 2)).map((_, idx) => {
                    return <Skeleton key={idx} width={idx === 0 ? '112px' : '68px'} height='22px' />;
                })}
            </div>
            <div className='skeleton-box__contract-cards'>
                {Array.from(new Array(7)).map((_, idx) => (
                    <Skeleton key={idx} height='104px' />
                ))}
            </div>
        </div>
    );
};

export default PositionsLoader;
