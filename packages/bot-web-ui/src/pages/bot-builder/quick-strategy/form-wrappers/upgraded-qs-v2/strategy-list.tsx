import React, { useMemo } from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Link } from '@deriv-com/quill-ui';
import { STRATEGY_LIST, TRADE_TYPE_MAP, TStrategyGroup } from './trade-constants';

type TStrategyListProps = {
    category: string;
    search: string;
    is_searching: boolean;
    onSelectStrategy: (strategy: string, trade_type: string) => void;
};

type TStrategyBlock = {
    title: string;
    items: TStrategyGroup;
    onSelectStrategy: (strategy: string, trade_type: string) => void;
};

const StrategyBlock: React.FC<TStrategyBlock> = ({ title, items, onSelectStrategy }) => {

    console.log(items, 'items');
    return (
        <div className='strategy-template-picker__strategy'>
            <div className='strategy-template-picker__title'>
                <Text size='xs' weight='bold'>
                    {title}
                </Text>
            </div>
            {Object.entries(items).map(([key, item], index) => {
                console.log(key, 'what is this key');
                console.log(TRADE_TYPE_MAP[title], title, 'TRADE_TYPE_MAP[title]');
                return (
                    <div className='strategy-template-picker__links' key={`${index}-${title}`}>
                        <Link hasChevron size='sm' onClick={() => onSelectStrategy(key, TRADE_TYPE_MAP[title])}>
                            {item.label}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

const StrategyList = ({ category, search, is_searching, onSelectStrategy }: TStrategyListProps) => {
    const filtered_strategies = useMemo(() => {
        if (category === 'ALL' && !search) return STRATEGY_LIST;

        if (!search) {
            const strategies = STRATEGY_LIST[category];
            return {
                [category]: strategies,
            };
        }

        if (search) {
            const lowercaseSearch = search.toLowerCase();
            const filteredStrategies: typeof STRATEGY_LIST = {};

            if (category === 'ALL') {
                Object.entries(STRATEGY_LIST).forEach(([tradeType, strategies]) => {
                    const matchingStrategies = Object.entries(strategies).filter(([key, strategy]) =>
                        strategy.label.toLowerCase().includes(lowercaseSearch)
                    );

                    if (matchingStrategies.length > 0) {
                        filteredStrategies[tradeType] = Object.fromEntries(matchingStrategies);
                    }
                });
            } else {
                const strategies = STRATEGY_LIST[category];
                const matchingStrategies = Object.entries(strategies).filter(([key, strategy]) =>
                    strategy.label.toLowerCase().includes(lowercaseSearch)
                );

                if (matchingStrategies.length > 0) {
                    filteredStrategies[category] = Object.fromEntries(matchingStrategies);
                }
            }

            return filteredStrategies;
        }
    }, [category, search]);
    const has_results = filtered_strategies && Object.keys(filtered_strategies).length > 0;

    if (has_results) {
        return (
            <div className='strategy-template-picker__strategies'>
                {Object.entries(filtered_strategies).map(([type, items]) => {
                    return <StrategyBlock key={type} title={type} items={items} onSelectStrategy={onSelectStrategy} />;
                })}
            </div>
        );
    }

    return (
        <div className='no-results'>
            <Text size='xs'>{localize('No results found')}</Text>
        </div>
    );
};

export default StrategyList;
