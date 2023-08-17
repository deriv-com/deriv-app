import React from 'react';
import { getCardLabels } from '@deriv/shared';
import { Button, Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
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
            <Text size='xxxs' line_height='s' as='p' color='disabled' className='purchase-container__notification'>
                <Localize
                    i18n_default_text='<0>Note:</0> You can close your trade anytime. Be aware of slippage risk.'
                    components={[<Text key={0} weight='bold' size='xxxs' line_height='s' color='disabled' />]}
                />
            </Text>
        </Fieldset>
    );
};

export default AccumulatorsSellButton;
