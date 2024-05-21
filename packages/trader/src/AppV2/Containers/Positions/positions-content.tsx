import React from 'react';
import EmptyMessage from 'AppV2/Components/EmptyMessage';
import { TEmptyMessageProps } from 'AppV2/Components/EmptyMessage/empty-message';
import Filter from 'AppV2/Components/Filter';
import { isHighLow } from '@deriv/shared';
import { TClosedPositions } from './positions';

type TPositionsContentProps = Omit<TEmptyMessageProps, 'noMatchesFound'> & {
    noMatchesFound?: boolean;
    positions?: TClosedPositions;
    setContractTypeFilter: React.Dispatch<React.SetStateAction<string[]>>;
    contractTypeFilter: string[] | [];
};

//TODO: Implement contract card
const ContractCard = ({
    contractType,
    purchaseTime,
    shortcode,
}: {
    contractType?: string;
    purchaseTime?: number;
    shortcode?: string;
}) => (
    <div className='contract-card'>
        <div>{contractType}</div>
        <div>{purchaseTime}</div>
        <div>{`${isHighLow({ shortcode }) ? 'High/Low' : 'Rise/Fall'}`}</div>
    </div>
);

const PositionsContent = ({
    isClosedTab,
    noMatchesFound,
    onRedirectToTrade,
    positions = [],
    setContractTypeFilter,
    contractTypeFilter,
}: TPositionsContentProps) => {
    return (
        <div className={`positions-page__${isClosedTab ? 'closed' : 'open'}`}>
            <div className='positions-page__container'>
                {(!!positions.length || (!positions.length && noMatchesFound)) && (
                    <div className='positions-page__filter__wrapper'>
                        <Filter setContractTypeFilter={setContractTypeFilter} contractTypeFilter={contractTypeFilter} />
                    </div>
                )}
            </div>
            {positions.length ? (
                <React.Fragment>
                    {positions.map(({ contract_type, purchase_time, shortcode }) => (
                        <ContractCard
                            contractType={contract_type}
                            purchaseTime={purchase_time}
                            shortcode={shortcode}
                            key={purchase_time}
                        />
                    ))}
                </React.Fragment>
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
