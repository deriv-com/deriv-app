import React from 'react';
import { Icon, Money, DesktopWrapper, ContractCard } from '@deriv/components';
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
    const { amount, contract_info, currency, is_footer, is_sell_requested, status } = props;
    const { portfolio } = useStore();
    const { onClickSell } = portfolio;
    const [movement, setMovement] = React.useState<string | null>(null);
    const [amount_state, setAmountState] = React.useState(0);

    React.useEffect(() => {
        setMovement(() => {
            return amount >= amount_state ? 'profit' : 'loss';
        });
        setAmountState(amount);
    }, [amount, amount_state]);

    return (
        <div className='open-positions__indicative'>
            <div className='open-positions__indicative--amount'>
                <Money amount={Math.abs(amount)} currency={currency} />
                {status !== 'no-resale' && amount !== 0 && (
                    <React.Fragment>
                        {movement === 'profit' && <Icon icon='IcProfit' />}
                        {movement === 'loss' && <Icon icon='IcLoss' />}
                    </React.Fragment>
                )}
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
