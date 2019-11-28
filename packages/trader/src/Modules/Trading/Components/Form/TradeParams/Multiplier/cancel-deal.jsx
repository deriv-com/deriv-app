import PropTypes    from 'prop-types';
import React        from 'react';
import {
    Checkbox,
    Popover }       from 'deriv-components';
import { localize } from 'App/i18n';
import Fieldset     from 'App/Components/Form/fieldset.jsx';
import { connect }  from 'Stores/connect';

const CancelDeal = ({
    cancel_deal,
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
        </Fieldset>
    );
};

CancelDeal.propTypes = {
    cancel_deal     : PropTypes.number,
    onChangeMultiple: PropTypes.func,
};

export default connect(({ modules }) => ({
    cancel_deal     : modules.trade.cancel_deal,
    onChangeMultiple: modules.trade.onChangeMultiple,
}))(CancelDeal);
