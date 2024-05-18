import React from 'react';
import { TPortfolioPosition } from '@deriv/stores/types';
import EmptyMessage from 'AppV2/Components/EmptyMessage';
import { TEmptyMessageProps } from 'AppV2/Components/EmptyMessage/empty-message';

type TPositionsContentProps = Omit<TEmptyMessageProps, 'noMatchesFound'> & {
    positions?: TPortfolioPosition[];
};

const PositionsContent = ({ isClosedTab, onRedirectToTrade, positions = [] }: TPositionsContentProps) => {
    const noMatchesFound = false; // TODO: Implement noMatchesFound state change based on filter results
    return (
        <div className={`positions-page__${isClosedTab ? 'closed' : 'open'}`}>
            {positions.length ? (
                <></>
            ) : (
                <EmptyMessage
                    isClosedTab={isClosedTab}
                    onRedirectToTrade={onRedirectToTrade}
                    noMatchesFound={noMatchesFound}
                />
            )}
        </div>
    );
};

export default PositionsContent;
