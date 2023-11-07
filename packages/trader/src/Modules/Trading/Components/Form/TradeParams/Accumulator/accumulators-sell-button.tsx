import React from 'react';
import { getCardLabels, isValidToSell } from '@deriv/shared';
import { Button, Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset';
import { observer, useStore } from '@deriv/stores';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';

type TAccumSellButton = {
    contract_info?: TContractInfo;
    current_stake: number | null;
    currency?: string;
    is_disabled: boolean;
    is_sell_requested?: boolean;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
};
const AccumulatorsSellButton = observer(
    ({ contract_info, current_stake, currency, is_disabled, is_sell_requested, onClick }: TAccumSellButton) => {
        const { ui } = useStore();
        const { is_dark_mode_on } = ui;
        const is_valid_to_sell = contract_info && isValidToSell(contract_info);
        return (
            <Fieldset className='trade-container__fieldset purchase-container__sell-button'>
                <Button
                    className='dc-btn--sell dc-btn__large'
                    is_disabled={is_disabled || !is_valid_to_sell || is_sell_requested}
                    onClick={onClick}
                    secondary
                >
                    <span className='purchase-container__sell-button__stake'>{getCardLabels().SELL}</span>
                    {current_stake && <Money amount={current_stake} currency={currency} show_currency />}
                </Button>
                <Text
                    size='xxxs'
                    line_height='s'
                    as='p'
                    color={is_dark_mode_on ? 'less-prominent' : 'disabled'}
                    className='purchase-container__notification'
                >
                    <Localize
                        i18n_default_text='<0>Note:</0> You can close your trade anytime. Be aware of slippage risk.'
                        components={[
                            <Text
                                key={0}
                                weight='bold'
                                size='xxxs'
                                line_height='s'
                                color={is_dark_mode_on ? 'less-prominent' : 'disabled'}
                            />,
                        ]}
                    />
                </Text>
            </Fieldset>
        );
    }
);

export default AccumulatorsSellButton;
