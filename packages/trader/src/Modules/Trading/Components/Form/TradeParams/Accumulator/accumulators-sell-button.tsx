import React from 'react';
import { getCardLabels } from '@deriv/shared';
import { Button, Money } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';

type TAccumSellButton = {
    current_stake: number | null;
    currency?: string;
    is_disabled: boolean;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
};
const AccumulatorsSellButton = ({ current_stake, currency, is_disabled, onClick }: TAccumSellButton) => {
    return (
        <Fieldset className='trade-container__fieldset purchase-container__cell-button'>
            <Button className='dc-btn--sell dc-btn__large' is_disabled={is_disabled} onClick={onClick} secondary>
                <span className='purchase-container__cell-button__stake'>{getCardLabels().SELL}</span>
                {current_stake && <Money amount={current_stake} currency={currency} show_currency />}
            </Button>
        </Fieldset>
    );
};

export default AccumulatorsSellButton;
