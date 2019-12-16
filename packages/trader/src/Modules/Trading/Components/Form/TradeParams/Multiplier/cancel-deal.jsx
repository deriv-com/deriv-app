import PropTypes    from 'prop-types';
import React        from 'react';
import {
    Checkbox,
    Popover }       from 'deriv-components';
import { localize } from 'deriv-translations';
import Fieldset     from 'App/Components/Form/fieldset.jsx';
import { connect }  from 'Stores/connect';

const CancelDeal = ({
    has_deal_cancellation,
    onChangeMultiple,
}) => {
    const changeValue = () => {
        // e.target.checked is not reliable, we have to toggle its previous value
        const new_val = !has_deal_cancellation;
        onChangeMultiple({
            has_deal_cancellation: new_val,
            ...(!new_val ? {
                // reset deal cancellation price
                deal_cancellation_price: 0,
            } : {
                // unchecked Take profit & Stop loss
                has_stop_loss  : false,
                has_take_profit: false,
            }),
        });
    };

    return (
        <Fieldset className='trade-container__fieldset'>
            <div className='input-wrapper--inline'>
                <Checkbox
                    id='dt_deal_cancellation-checkbox_input'
                    onChange={changeValue}
                    name='has_deal_cancellation'
                    label={localize('Cancel deal')}
                    defaultChecked={has_deal_cancellation}
                />
                <Popover
                    alignment='left'
                    icon='info'
                    id='dt_deal_cancellation-checkbox__tooltip'
                    message={localize('Allows you to cancel this deal (within 1 hour) to avoid loss.')}
                    margin={210}
                />
            </div>
        </Fieldset>
    );
};

CancelDeal.propTypes = {
    has_deal_cancellation: PropTypes.bool,
    onChangeMultiple     : PropTypes.func,
};

export default connect(({ modules }) => ({
    has_deal_cancellation: modules.trade.has_deal_cancellation,
    onChangeMultiple     : modules.trade.onChangeMultiple,
}))(CancelDeal);
