import classNames from 'classnames';
import React from 'react';
import { Icon, Money } from '@deriv/components';
import ContractInfo from './contract-info';

type TValueMovement = Partial<
    Pick<
        React.ComponentProps<typeof ContractInfo>,
        'is_turbos' | 'is_vanilla' | 'currency' | 'has_increased' | 'proposal_info'
    >
> & {
    has_error_or_not_loaded: boolean;
    value?: number | string;
    show_currency?: boolean;
};
const ValueMovement = ({
    has_error_or_not_loaded,
    proposal_info,
    currency,
    has_increased,
    is_turbos = false,
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
                        'trade-container__price-info-currency--payout-per-point': is_vanilla || is_turbos,
                    })}
                    currency={currency}
                    should_format={!is_turbos && !is_vanilla}
                    show_currency={show_currency}
                />
            )}
        </div>
        <div className='trade-container__price-info-movement'>
            {!has_error_or_not_loaded && has_increased !== null && has_increased ? (
                <Icon icon='IcProfit' />
            ) : (
                <Icon icon='IcLoss' />
            )}
        </div>
    </div>
);

export default ValueMovement;
