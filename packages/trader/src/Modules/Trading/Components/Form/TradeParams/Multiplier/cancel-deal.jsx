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
    cost_of_deal_cancellation,
    currency,
    onChange,
}) => {
    const changeValue = (e) => {
        e.persist();
        const { name, checked } = e.target;
        onChange({ target: { name, value: Number(checked) } });
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
                    message={localize('Allows you to undo the deal within 1 hour to avoid loss.')}
                    margin={210}
                />
            </div>
            <p className='trade-container__fieldset-text'>
                <Localize
                    i18n_default_text='Price: <0/>'
                    components={[<Money
                        key={0}
                        amount={cost_of_deal_cancellation}
                        currency={currency}
                    />]}
                />
            </p>
        </Fieldset>
    );
};

CancelDeal.propTypes = {
    cancel_deal              : PropTypes.number,
    cost_of_deal_cancellation: PropTypes.number,
    currency                 : PropTypes.string,
    onChange                 : PropTypes.func,
};

export default connect(({ modules }) => ({
    cancel_deal              : modules.trade.cancel_deal,
    currency                 : modules.trade.currency,
    cost_of_deal_cancellation: modules.trade.cost_of_deal_cancellation,
    onChange                 : modules.trade.onChange,
}))(CancelDeal);
