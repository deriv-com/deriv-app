import React from 'react';
import { Skeleton } from '../../skeleton';

type TPositionsLoaderProps = {
    initial_app_loading?: boolean;
    is_closed_tab?: boolean;
};

const PositionsLoader = ({ initial_app_loading, is_closed_tab }: TPositionsLoaderProps) => {
    return (
        <div className='loading-dtrader-v2__positions' data-testid='dt_positions_loader'>
            {initial_app_loading && (
                <div className='skeleton-box__tabs' data-testid='dt_tabs_skeleton'>
                    {[...new Array(2)].map((_, idx) => {
                        return <Skeleton key={idx} width={56} height={22} />;
                    })}
                </div>
            )}
            <div className='skeleton-box__filters'>
                <Skeleton width={144} height={32} />
            </div>
            <div className='skeleton-box__total-pnl-or-date'>
                {[...new Array(is_closed_tab ? 1 : 2)].map((_, idx) => {
                    return <Skeleton key={idx} width={idx === 0 ? 112 : 68} height={22} />;
                })}
            </div>
            <div className='skeleton-box__contract-cards'>
                {[...new Array(7)].map((_, idx) => (
                    <Skeleton key={idx} height={104} />
                ))}
            </div>
        </div>
    );
};

export default PositionsLoader;
