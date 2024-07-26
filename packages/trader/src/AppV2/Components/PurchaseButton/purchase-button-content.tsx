import React from 'react';
import clsx from 'clsx';
import { CaptionText } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { getLocalizedBasis } from '@deriv/shared';
import { Money } from '@deriv/components';

type TPurchaseButtonContent = {
    current_stake?: number | null;
    info: ReturnType<typeof useTraderStore>['proposal_info'][0];
    is_reverse?: boolean;
} & Pick<
    ReturnType<typeof useTraderStore>,
    | 'currency'
    | 'has_open_accu_contract'
    | 'is_accumulator'
    | 'is_multiplier'
    | 'is_vanilla_fx'
    | 'is_vanilla'
    | 'is_turbos'
>;

const PurchaseButtonContent = ({
    currency,
    current_stake,
    has_open_accu_contract,
    info,
    is_accumulator,
    is_multiplier,
    is_turbos,
    is_vanilla,
    is_vanilla_fx,
    is_reverse,
}: TPurchaseButtonContent) => {
    const {
        current_stake: localized_current_stake,
        max_payout,
        payout,
        payout_per_point,
        payout_per_pip,
        stake,
    } = getLocalizedBasis();

    const getAmount = () => {
        const { stake, maximum_payout, obj_contract_basis } = info;

        if (is_multiplier) return stake;
        if (is_accumulator) return has_open_accu_contract ? Number(current_stake) : maximum_payout;
        return obj_contract_basis?.value;
    };
    const getTextBasis = () => {
        if (is_turbos || (is_vanilla && !is_vanilla_fx)) return payout_per_point;
        if (is_vanilla_fx) return payout_per_pip;
        if (is_multiplier) return stake;
        if (is_accumulator) return has_open_accu_contract ? localized_current_stake : max_payout;
        return payout;
    };

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
            {!is_content_empty && (
                <React.Fragment>
                    <CaptionText
                        as='span'
                        size='sm'
                        className={clsx(!has_open_accu_contract && 'purchase-button__information__item')}
                    >
                        {text_basis}
                    </CaptionText>
                    <CaptionText
                        as='span'
                        size='sm'
                        className={clsx(!has_open_accu_contract && 'purchase-button__information__item')}
                    >
                        <Money
                            amount={amount}
                            currency={currency}
                            should_format={!is_turbos && !is_vanilla}
                            show_currency
                        />
                    </CaptionText>
                </React.Fragment>
            )}
        </CaptionText>
    );
};

export default PurchaseButtonContent;
