import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CancelDealInfo = ({ currency, has_cancellation, proposal_info }) => {
    const { id, cancellation, has_error } = proposal_info;
    const error = has_error || !id;

    if (!has_cancellation) return null;

    return (
        <div className='trade-container__cancel-deal-info'>
            {cancellation && (
                <React.Fragment>
                    <div className='trade-container__price-info-basis'>{localize('Deal cancel. fee')}</div>
                    <div className='trade-container__price-info-value'>
                        {!error && (
                            <Money
                                amount={cancellation.ask_price}
                                className='trade-container__price-info-currency'
                                currency={currency}
                                show_currency
                            />
                        )}
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

export default connect(({ modules }) => ({
    has_cancellation: modules.trade.has_cancellation,
    currency: modules.trade.currency,
}))(CancelDealInfo);
