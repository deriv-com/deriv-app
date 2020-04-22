import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import PopoverMessageCheckbox from 'Modules/Trading/Components/Elements/popover-message-checkbox.jsx';

const CancelDeal = ({
    has_cancellation,
    has_stop_loss,
    onChangeMultiple,
    should_show_cancellation_warning,
    toggleCancellationWarning,
}) => {
    const changeValue = () => {
        // e.target.checked is not reliable, we have to toggle its previous value
        const new_val = !has_cancellation;
        onChangeMultiple({
            has_cancellation: new_val,
            ...(!new_val
                ? {
                      // reset deal cancellation price
                      cancellation_price: 0,
                  }
                : {
                      // unchecked Stop loss
                      has_stop_loss: false,
                  }),
        });
    };

    const should_show_popover = has_stop_loss && should_show_cancellation_warning;

    const input = (
        <Checkbox
            id='dt_cancellation-checkbox_input'
            onChange={changeValue}
            name='has_cancellation'
            label={localize('Deal cancellation')}
            defaultChecked={has_cancellation}
        />
    );

    return (
        <Fieldset className='trade-container__fieldset'>
            <div className='input-wrapper--inline'>
                {should_show_popover ? (
                    <Popover
                        alignment='left'
                        classNameBubble='trade-container__popover'
                        is_bubble_hover_enabled
                        margin={2}
                        message={
                            <PopoverMessageCheckbox
                                defaultChecked={!should_show_cancellation_warning}
                                message={localize('You may choose either stop loss or deal cancellation.')}
                                name='should_show_cancellation_warning'
                                onChange={() => toggleCancellationWarning()}
                            />
                        }
                    >
                        {input}
                    </Popover>
                ) : (
                    <React.Fragment>{input}</React.Fragment>
                )}
                <Popover
                    alignment='left'
                    icon='info'
                    id='dt_cancellation-checkbox__tooltip'
                    message={localize('Allows you to cancel this deal (within 1 hour) to avoid loss.')}
                    margin={210}
                />
            </div>
        </Fieldset>
    );
};

CancelDeal.propTypes = {
    has_cancellation: PropTypes.bool,
    has_stop_loss: PropTypes.bool,
    onChangeMultiple: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    toggleCancellationWarning: PropTypes.func,
};

export default connect(({ modules, ui }) => ({
    has_cancellation: modules.trade.has_cancellation,
    has_stop_loss: modules.trade.has_stop_loss,
    onChangeMultiple: modules.trade.onChangeMultiple,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    toggleCancellationWarning: ui.toggleCancellationWarning,
}))(CancelDeal);
