import React from 'react';
import { TPortfolioPosition } from '@deriv/stores/types';
import EmptyMessage from 'AppV2/Components/EmptyMessage';
import { TEmptyMessageProps } from 'AppV2/Components/EmptyMessage/empty-message';
import Filter from 'AppV2/Components/Filter';
import { isHighLow } from '@deriv/shared';

type TPositionsContentProps = Omit<TEmptyMessageProps, 'noMatchesFound'> & {
    noMatchesFound?: boolean;
    positions?: TPortfolioPosition[];
    setContractTypeFilter: React.Dispatch<React.SetStateAction<string[]>>;
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
}: TPositionsContentProps) => {
    return (
        <div className={`positions-page__${isClosedTab ? 'closed' : 'open'}`}>
            <div className='positions-page__container'>
                <div className='positions-page__filter__wrapper'>
                    {(positions.length || (!positions.length && noMatchesFound)) && (
                        <Filter setContractTypeFilter={setContractTypeFilter} />
                    )}
                </div>
            </div>
            {positions.length ? (
                <React.Fragment>
                    {positions.map(({ contract_info }) => (
                        <ContractCard
                            contractType={contract_info.contract_type}
                            purchaseTime={contract_info.purchase_time}
                            shortcode={contract_info.shortcode}
                            key={contract_info.purchase_time}
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
