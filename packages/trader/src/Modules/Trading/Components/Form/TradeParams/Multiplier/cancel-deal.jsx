import PropTypes    from 'prop-types';
import React        from 'react';
import {
    Checkbox,
    Money,
    Popover }       from 'deriv-components';
import { localize } from 'App/i18n';
import Localize     from 'App/Components/Elements/localize.jsx';
import Fieldset     from 'App/Components/Form/fieldset.jsx';
import { connect }  from 'Stores/connect';

const CancelDeal = ({
    cancel_deal,
    deal_cancellation_price,
    currency,
    onChangeMultiple,
}) => {
    const changeValue = (e) => {
        e.persist();
        const new_val = Number(e.target.checked);
        onChangeMultiple({
            cancel_deal: new_val,
            // set deal_cancellation_price to 0 only if Cancel Deal is un-checked
            ...(!new_val ? { deal_cancellation_price: 0 } : {}),
        });
    };

    return (
        <Fieldset className='trade-container__fieldset'>
            <div className='input-wrapper--inline'>
                <Checkbox
                    id='dt_cancel_deal-checkbox_input'
                    onChange={changeValue}
                    name='cancel_deal'
                    label={localize('Cancel deal')}
                    defaultChecked={cancel_deal}
                />
                <Popover
                    alignment='left'
                    icon='info'
                    id='dt_cancel_deal-checkbox__tooltip'
                    message={localize('Allows you to cancel this deal (within 1 hour) to avoid loss.')}
                    margin={210}
                />
            </div>
            <p className='trade-container__fieldset-text'>
                <Localize
                    i18n_default_text='Price: <0/>'
                    components={[<Money
                        key={0}
                        amount={deal_cancellation_price}
                        currency={currency}
                    />]}
                />
            </p>
        </Fieldset>
    );
};

CancelDeal.propTypes = {
    cancel_deal            : PropTypes.number,
    currency               : PropTypes.string,
    deal_cancellation_price: PropTypes.number,
    onChangeMultiple       : PropTypes.func,
};

export default connect(({ modules }) => ({
    cancel_deal            : modules.trade.cancel_deal,
    currency               : modules.trade.currency,
    deal_cancellation_price: modules.trade.deal_cancellation_price,
    onChangeMultiple       : modules.trade.onChangeMultiple,
}))(CancelDeal);
