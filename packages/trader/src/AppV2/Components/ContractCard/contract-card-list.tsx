import {
    getContractPath,
    getCurrentTick,
    getTotalProfit,
    getTradeTypeName,
    isHighLow,
    isMultiplierContract,
    isValidToCancel,
    isValidToSell,
} from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import React from 'react';
import ContractCard from './contract-card';

export type TContractCardListProps = {
    currency?: string;
    onClickCancel?: (contractId: number) => void;
    onClickSell?: (contractId: number) => void;
    positions?: TPortfolioPosition[];
};

const ContractCardList = ({ onClickCancel, onClickSell, positions = [], ...rest }: TContractCardListProps) => {
    // TODO: make it work not only with an open position data but also with a profit_table transaction data
    const timeoutIds = React.useRef<Array<ReturnType<typeof setTimeout>>>([]);

    React.useEffect(() => {
        const timers = timeoutIds.current;
        return () => {
            if (timers.length) {
                timers.forEach(id => clearTimeout(id));
            }
        };
    }, []);

    const handleClose = (id: number, shouldCancel?: boolean) => {
        const timeoutId = setTimeout(() => {
            shouldCancel ? onClickCancel?.(id) : onClickSell?.(id);
        }, 160);
        timeoutIds.current.push(timeoutId);
    };

    if (!positions.length) return null;
    return (
        <div className='contract-card-list'>
            {positions.map(({ id, is_sell_requested, contract_info }) => {
                const { contract_type, display_name, profit, shortcode } = contract_info;
                const contract_main_title = getTradeTypeName(contract_type ?? '', {
                    isHighLow: isHighLow({ shortcode }),
                    showMainTitle: true,
                });
                const currentTick = contract_info.tick_count ? getCurrentTick(contract_info) : null;
                const tradeTypeName = `${contract_main_title} ${getTradeTypeName(contract_type ?? '', {
                    isHighLow: isHighLow({ shortcode }),
                })}`.trim();
                const isMultiplier = isMultiplierContract(contract_type);
                const validToCancel = isValidToCancel(contract_info);
                const validToSell = isValidToSell(contract_info) && !is_sell_requested;
                const totalProfit = isMultiplierContract(contract_type) ? getTotalProfit(contract_info) : profit;
                return (
                    <ContractCard
                        key={id ?? contract_info.contract_id}
                        {...contract_info}
                        {...rest}
                        currentTick={currentTick}
                        isMultiplier={isMultiplier}
                        isValidToCancel={validToCancel}
                        isValidToSell={validToSell}
                        onCancel={() => id && handleClose?.(id, true)}
                        onClose={() => id && handleClose?.(id)}
                        redirectTo={getContractPath(id)}
                        symbolName={display_name}
                        totalProfit={totalProfit}
                        tradeTypeName={tradeTypeName}
                    />
                );
            })}
        </div>
    );
};

export default ContractCardList;
