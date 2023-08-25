import React from 'react';
import { Icon, Money, DesktopWrapper, ContractCard } from '@deriv/components';
import { getCardLabels, TContractInfo } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { TRootStore } from 'Stores/index';

type TIndicativeCell = {
    amount: number;
    contract_info: TContractInfo;
    currency: string;
    status: string;
    is_footer: boolean;
    is_sell_requested: boolean;
    onClickSell: () => void;
};

const IndicativeCell = ({
    amount,
    currency,
    contract_info,
    is_footer,
    onClickSell,
    is_sell_requested,
}: TIndicativeCell) => {
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
                        onClickSell={onClickSell}
                    />
                )}
            </DesktopWrapper>
        </div>
    );
};

export default connect(({ portfolio }: TRootStore) => ({
    onClickSell: portfolio.onClickSell,
}))(IndicativeCell);
