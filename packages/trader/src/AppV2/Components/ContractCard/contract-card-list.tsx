import { getContractPath } from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import React from 'react';
import ContractCard from './contract-card';
import classNames from 'classnames';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';

export type TContractCardListProps = {
    currency?: string;
    hasButtonsDemo?: boolean;
    onClickCancel?: (contractId: number) => void;
    onClickSell?: (contractId: number) => void;
    positions?: (TPortfolioPosition | TClosedPosition)[];
    setHasButtonsDemo?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ContractCardList = ({
    currency,
    hasButtonsDemo,
    onClickCancel,
    onClickSell,
    positions = [],
    setHasButtonsDemo,
}: TContractCardListProps) => {
    const closedCardsTimeouts = React.useRef<Array<ReturnType<typeof setTimeout>>>([]);

    React.useEffect(() => {
        const timers = closedCardsTimeouts.current;
        const demoTimeout = setTimeout(() => setHasButtonsDemo?.(false), 720);
        return () => {
            if (timers.length) {
                timers.forEach(id => clearTimeout(id));
            }
            if (demoTimeout) clearTimeout(demoTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = (id: number, shouldCancel?: boolean) => {
        const timeoutId = setTimeout(() => {
            shouldCancel ? onClickCancel?.(id) : onClickSell?.(id);
        }, 160);
        closedCardsTimeouts.current.push(timeoutId);
    };

    if (!positions.length) return null;
    return (
        <div
            className={classNames('contract-card-list', {
                'contract-card-list--has-buttons-demo': hasButtonsDemo && !positions[0].contract_info.sell_time,
            })}
        >
            {positions.map(position => {
                const { contract_id: id } = position.contract_info;
                return (
                    <ContractCard
                        key={id}
                        contractInfo={position.contract_info}
                        currency={currency}
                        id={id}
                        isSellRequested={(position as TPortfolioPosition).is_sell_requested}
                        onCancel={() => id && handleClose?.(id, true)}
                        onClose={() => id && handleClose?.(id)}
                        redirectTo={id ? getContractPath(id) : undefined}
                    />
                );
            })}
        </div>
    );
};

export default ContractCardList;
