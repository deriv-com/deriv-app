import React from 'react';
import EmptyMessage from 'AppV2/Components/EmptyMessage';
import { TEmptyMessageProps } from 'AppV2/Components/EmptyMessage/empty-message';
import { TPortfolioPosition } from '@deriv/stores/types';
import { ContractCardList } from 'AppV2/Components/ContractCard';
import { ContractTypeFilter, TimeFilter } from 'AppV2/Components/Filter';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { filterPositions } from '../../Utils/positions-utils';
import { TReportsStore, useReportsStore } from '../../../../../reports/src/Stores/useReportsStores';

type TPositionsContentProps = Omit<TEmptyMessageProps, 'noMatchesFound'> & {
    hasButtonsDemo?: boolean;
    setHasButtonsDemo?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TClosedPosition = {
    contract_info: TReportsStore['profit_table']['data'][number];
};

const PositionsContent = observer(
    ({ hasButtonsDemo, isClosedTab, onRedirectToTrade, setHasButtonsDemo }: TPositionsContentProps) => {
        const [contractTypeFilter, setContractTypeFilter] = React.useState<string[]>([]);
        const [chosenTimeFilter, setChosenTimeFilter] = React.useState<string>('');
        const [filteredPositions, setFilteredPositions] = React.useState<(TPortfolioPosition | TClosedPosition)[]>([]);
        const [noMatchesFound, setNoMatchesFound] = React.useState(false);

        const { client, portfolio } = useStore();
        const { currency } = client;
        const { active_positions, is_active_empty, onClickCancel, onClickSell, onMount: onOpenTabMount } = portfolio;
        const {
            data,
            is_empty,
            is_loading: isLoading,
            onMount: onClosedTabMount,
            handleDateChange,
        } = useReportsStore().profit_table;
        const closedPositions = React.useMemo(() => data.map(d => ({ contract_info: d })), [data]);
        const positions = React.useMemo(
            () => (isClosedTab ? closedPositions : active_positions),
            [active_positions, isClosedTab, closedPositions]
        );
        const emptyPositions = isClosedTab ? is_empty : is_active_empty;
        const shouldShowEmptyMessage = emptyPositions || noMatchesFound;

        React.useEffect(() => {
            isClosedTab ? onClosedTabMount() : onOpenTabMount();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        React.useEffect(() => {
            if (contractTypeFilter.length) {
                const result = filterPositions(positions, contractTypeFilter);
                setNoMatchesFound(!result.length);
                setFilteredPositions(result);
            } else {
                setNoMatchesFound(false);
                setFilteredPositions(positions);
            }
        }, [contractTypeFilter, positions]);

        if (isLoading) return <Loading />;
        return (
            <div className={`positions-page__${isClosedTab ? 'closed' : 'open'}`}>
                <div className='positions-page__container'>
                    {!emptyPositions && (
                        <div className='positions-page__filter__wrapper'>
                            {isClosedTab && (
                                <TimeFilter
                                    chosenTimeFilter={chosenTimeFilter}
                                    setChosenTimeFilter={setChosenTimeFilter}
                                    handleDateChange={handleDateChange}
                                />
                            )}
                            <ContractTypeFilter
                                setContractTypeFilter={setContractTypeFilter}
                                contractTypeFilter={contractTypeFilter}
                            />
                        </div>
                    )}
                </div>
                {shouldShowEmptyMessage ? (
                    <EmptyMessage
                        isClosedTab={isClosedTab}
                        onRedirectToTrade={onRedirectToTrade}
                        noMatchesFound={noMatchesFound}
                    />
                ) : (
                    <ContractCardList
                        currency={currency}
                        hasButtonsDemo={hasButtonsDemo}
                        onClickCancel={isClosedTab ? undefined : onClickCancel}
                        onClickSell={isClosedTab ? undefined : onClickSell}
                        positions={filteredPositions}
                        setHasButtonsDemo={setHasButtonsDemo}
                    />
                )}
            </div>
        );
    }
);

export default PositionsContent;
