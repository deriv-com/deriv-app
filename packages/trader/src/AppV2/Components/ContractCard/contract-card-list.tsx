import React from 'react';
import { getContractPath } from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import classNames from 'classnames';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import { TRootStore } from 'Types';
import ContractCard from './contract-card';

export type TContractCardListProps = {
    currency?: string;
    hasButtonsDemo?: boolean;
    onClickCancel?: (contractId: number) => void;
    onClickSell?: (contractId: number) => void;
    positions?: (TPortfolioPosition | TClosedPosition)[];
    setHasButtonsDemo?: React.Dispatch<React.SetStateAction<boolean>>;
    serverTime: TRootStore['common']['server_time'];
};

const ContractCardList = ({
    currency,
    hasButtonsDemo,
    onClickCancel,
    onClickSell,
    positions = [],
    serverTime,
    setHasButtonsDemo,
}: TContractCardListProps) => {
    React.useEffect(() => {
        const demoTimeout = setTimeout(() => setHasButtonsDemo?.(false), 720); // 720 is the length of demo animation
        return () => {
            if (demoTimeout) clearTimeout(demoTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        hasActionButtons={!!onClickSell}
                        isSellRequested={(position as TPortfolioPosition).is_sell_requested}
                        onCancel={() => id && onClickCancel?.(id)}
                        onClose={() => id && onClickSell?.(id)}
                        redirectTo={id ? getContractPath(id) : undefined}
                        serverTime={serverTime}
                    />
                );
            })}
        </div>
    );
};

export default ContractCardList;
