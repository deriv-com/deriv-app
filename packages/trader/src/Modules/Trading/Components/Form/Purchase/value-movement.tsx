import classNames from 'classnames';
import React from 'react';
import { ArrowIndicator, Money } from '@deriv/components';
import ContractInfo from './contract-info';

type TValueMovement = Partial<
    Pick<React.ComponentProps<typeof ContractInfo>, 'is_vanilla' | 'currency' | 'proposal_info'>
> & {
    has_error_or_not_loaded: boolean;
    value?: number | string;
    show_currency?: boolean;
};
const ValueMovement = ({
    has_error_or_not_loaded,
    proposal_info,
    currency,
    is_vanilla = false,
    value,
    show_currency = true,
}: TValueMovement) => (
    <div className='price-info--value-container'>
        <div className='trade-container__price-info-value'>
            {!has_error_or_not_loaded && (
                <Money
                    amount={proposal_info?.obj_contract_basis?.value || value}
                    className={classNames('trade-container__price-info-currency', {
                        'trade-container__price-info-currency--payout-per-point': is_vanilla,
                    })}
                    currency={currency}
                    should_format={!is_vanilla}
                    show_currency={show_currency}
                />
            )}
        </div>
        <ArrowIndicator
            className='trade-container__price-info-movement'
            value={proposal_info?.obj_contract_basis?.value || value}
        />
    </div>
);

export default ValueMovement;
