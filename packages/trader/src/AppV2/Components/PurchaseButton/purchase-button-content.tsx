import React from 'react';
import clsx from 'clsx';
import { CaptionText } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { getLocalizedBasis } from '@deriv/shared';
import { Money } from '@deriv/components';

type TPurchaseButtonContent = {
    current_stake?: number | null;
    error?: React.ReactNode;
    info: ReturnType<typeof useTraderStore>['proposal_info'][0] | Record<string, never>;
    is_reverse?: boolean;
    is_high_low?: boolean;
} & Pick<
    ReturnType<typeof useTraderStore>,
    | 'currency'
    | 'has_open_accu_contract'
    | 'is_accumulator'
    | 'is_multiplier'
    | 'is_vanilla_fx'
    | 'is_vanilla'
    | 'is_turbos'
    | 'is_touch'
>;

const PurchaseButtonContent = ({
    currency,
    current_stake,
    error,
    has_open_accu_contract,
    info,
    is_accumulator,
    is_high_low,
    is_multiplier,
    is_turbos,
    is_vanilla,
    is_vanilla_fx,
    is_reverse,
    is_touch,
}: TPurchaseButtonContent) => {
    const { current_stake: localized_current_stake, payout, stake } = getLocalizedBasis();

    const getAmount = () => {
        const { stake, obj_contract_basis } = info;

        if (is_multiplier) return stake;
        if (is_accumulator) return Number(current_stake);
        return obj_contract_basis?.value;
    };
    const getTextBasis = () => {
        if (is_multiplier) return stake;
        if (is_accumulator) return localized_current_stake;
        return payout;
    };

    if (is_vanilla || is_vanilla_fx || is_turbos || is_high_low || is_touch) return null;
    if (is_accumulator && !has_open_accu_contract) return null;

    const text_basis = getTextBasis();
    const amount = getAmount();
    const is_content_empty = !text_basis || !amount;

    return (
        <CaptionText
            size='sm'
            className={clsx(
                'purchase-button__information__wrapper',
                is_reverse && 'purchase-button__information__wrapper--reverse',
                is_content_empty && 'purchase-button__information__wrapper--disabled-placeholder'
            )}
            data-testid='dt_purchase_button_wrapper'
        >
            {(!is_content_empty || error) && (
                <React.Fragment>
                    <CaptionText
                        as='span'
                        size='sm'
                        className={clsx(!has_open_accu_contract && 'purchase-button__information__item')}
                    >
                        {!error && text_basis}
                    </CaptionText>
                    <CaptionText
                        as='span'
                        size='sm'
                        className={clsx(!has_open_accu_contract && 'purchase-button__information__item')}
                    >
                        {error || (
                            <Money
                                amount={amount}
                                currency={currency}
                                should_format={!is_turbos && !is_vanilla}
                                show_currency
                            />
                        )}
                    </CaptionText>
                </React.Fragment>
            )}
        </CaptionText>
    );
};

export default PurchaseButtonContent;
