import React from 'react';
import { Skeleton } from 'AppV2/Components/Skeleton';
import { ContractCardLoader } from 'AppV2/Components/ContractCard';

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
            <div className='skeleton-total-pnl-or-date'>
                {Array.from(new Array(isClosedTab ? 1 : 2)).map((_, idx) => {
                    return <Skeleton key={idx} width={idx === 0 ? '112px' : '68px'} height='22px' />;
                })}
            </div>
            <div className='skeleton-contract-card-list'>
                {Array.from(new Array(7)).map((_, idx) => (
                    <ContractCardLoader key={idx} />
                ))}
            </div>
        </div>
    );
};

export default PositionsLoader;
