import React from 'react';
import { Link } from '@deriv-com/quill-ui';
import { Text } from '@deriv/components';
import { TStrategyValue, TTradeType } from './trade-constants';
import { localize } from '@deriv/translations';

type TStrategyListProps = {
    option: number;
    trade_types: string[];
    trade_types_values: (TTradeType | TTradeType[])[];
    search_value: string;
    is_searching: boolean;
    onSelectStrategy: (strategy: string, trade_type: string) => void;
};

const StrategyList = ({
    option,
    trade_types,
    trade_types_values,
    search_value,
    is_searching,
    onSelectStrategy,
}: TStrategyListProps) => {
    const [is_result_found, setIsResultFound] = React.useState(true);
    const filterVisibleContent = (strategy: string) => {
        const is_strategy_match_value = strategy.toLowerCase().includes(search_value.toLowerCase());
        return (is_searching && is_strategy_match_value) || !is_searching;
    };
    const is_trade_type_visible = filterVisibleContent(trade_types[option]);
    const trade_type_value = (trade_types_values[option] as TTradeType).value;
    const is_content_visible =
        is_trade_type_visible || trade_type_value?.some(strategy => filterVisibleContent(strategy.label));
    const shouldShowStrategies = (trade_types: string, strategy: string) =>
        !filterVisibleContent(trade_types) ? filterVisibleContent(strategy) : true;

    React.useEffect(() => {
        const has_visible_strategies = trade_types.some(trade_type => {
            const strategies = Array.isArray(trade_types_values[0])
                ? trade_types_values[0]?.find(strategy => strategy.name === trade_type)?.value
                : trade_types_values?.find(strategy => strategy.name === trade_type)?.value;
            return (
                filterVisibleContent(trade_type) ||
                strategies?.some((value: TStrategyValue) => filterVisibleContent(value.label))
            );
        });

        setIsResultFound(has_visible_strategies);
    }, [search_value, trade_types, trade_types_values, is_searching]);

    return (
        <div className='strategy-template-picker__strategies'>
            {!is_result_found && (
                <div className='no-results'>
                    <Text size='xs'>{localize('No results found')}</Text>
                </div>
            )}
            {option === 0 ? (
                trade_types.map((trade_type, index) => {
                    const has_visible_strategies =
                        filterVisibleContent(trade_type) ||
                        (Array.isArray(trade_types_values[0]) &&
                            trade_types_values[0]?.some(
                                (strategy: TTradeType) =>
                                    strategy.name === trade_type &&
                                    strategy.value.some(value => filterVisibleContent(value.label))
                            ));

                    const strategies =
                        (Array.isArray(trade_types_values[0]) &&
                            trade_types_values[0]?.find(strategy => strategy.name === trade_type)?.value) ||
                        trade_types_values?.find(strategy => strategy.name === trade_type)?.value ||
                        [];
                    return (
                        trade_type !== 'All' && (
                            <div key={index} className='strategy-template-picker__strategy'>
                                {has_visible_strategies && (
                                    <div className='strategy-template-picker__title'>
                                        <Text size='xs' weight='bold'>
                                            {trade_type}
                                        </Text>
                                    </div>
                                )}
                                {strategies.map(
                                    (strategy: TStrategyValue, idx: number) =>
                                        shouldShowStrategies(trade_type, strategy.label) && (
                                            <div className='strategy-template-picker__links' key={idx}>
                                                <Link
                                                    color={'var(--text-prominent)'}
                                                    hasChevron
                                                    size='sm'
                                                    onClick={() => onSelectStrategy(strategy.name, trade_type)}
                                                >
                                                    {strategy.label}
                                                </Link>
                                            </div>
                                        )
                                )}
                            </div>
                        )
                    );
                })
            ) : (
                <div className='strategy-template-picker__strategy'>
                    {is_content_visible && (
                        <div className='strategy-template-picker__title'>
                            <Text size='xs' weight='bold'>
                                {trade_types[option]}
                            </Text>
                        </div>
                    )}
                    {trade_type_value.map(
                        (strategy: TStrategyValue, index: number) =>
                            shouldShowStrategies(trade_types[option], strategy.label) && (
                                <div className='strategy-template-picker__links' key={index}>
                                    <Link
                                        color={'var(--text-prominent)'}
                                        hasChevron
                                        size='sm'
                                        onClick={() => onSelectStrategy(strategy.name, trade_types[option])}
                                    >
                                        {strategy.label}
                                    </Link>
                                </div>
                            )
                    )}
                </div>
            )}
        </div>
    );
};

export default StrategyList;
