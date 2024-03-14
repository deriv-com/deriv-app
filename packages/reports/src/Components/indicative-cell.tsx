import React from 'react';
import { ArrowIndicator, Money, DesktopWrapper, ContractCard } from '@deriv/components';
import { getCardLabels, TContractInfo } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

type TIndicativeCell = {
    amount: number;
    contract_info: TContractInfo;
    currency: string;
    status?: string;
    is_footer: boolean;
    is_sell_requested: boolean;
};

const IndicativeCell = observer((props: TIndicativeCell) => {
    const { amount, contract_info, currency, is_footer, is_sell_requested } = props;
    const { portfolio } = useStore();
    const { onClickSell } = portfolio;

    return (
        <div className='open-positions__indicative'>
            <div className='open-positions__indicative--amount'>
                <Money amount={Math.abs(amount)} currency={currency} />
                <ArrowIndicator value={amount} />
            </div>
            <DesktopWrapper>
                {!is_footer && (
                    <ContractCard.Sell
                        contract_info={contract_info}
                        is_sell_requested={is_sell_requested}
                        getCardLabels={getCardLabels}
                        onClickSell={contract_id => {
                            if (contract_id) onClickSell(contract_id);
                        }}
                    />
                )}
            </DesktopWrapper>
        </div>
    );
});

export default IndicativeCell;
