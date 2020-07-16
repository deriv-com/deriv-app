import React from 'react';
import { Checkbox, RadioGroup, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { onToggleCancellation, onChangeCancellationDuration } from 'Stores/Modules/Contract/Helpers/multiplier';
import Fieldset from 'App/Components/Form/fieldset.jsx';

const CancelDeal = ({ has_cancellation, onChangeMultiple, cancellation_duration, cancellation_range_list }) => {
    return (
        <Fieldset className='trade-container__fieldset'>
            <div className='input-wrapper--inline'>
                <Checkbox
                    id='dt_cancellation-checkbox_input'
                    onChange={() => onToggleCancellation({ has_cancellation, onChangeMultiple })}
                    name='has_cancellation'
                    label={localize('Deal cancellation')}
                    defaultChecked={has_cancellation}
                />
                <Popover
                    alignment='bottom'
                    icon='info'
                    id='dt_cancellation-checkbox__tooltip'
                    message={localize(
                        'Allows you to cancel your trade within a chosen time frame should the market move against your favour.'
                    )}
                    relative_render
                />
            </div>
            {has_cancellation && (
                <React.Fragment>
                    <div className='trade-params__multiplier-warning-label'>
                        {localize('Take profit and/or stop loss are not available while deal cancellation is active.')}
                    </div>
                    <RadioGroup
                        className='trade-params__multiplier-radio-group'
                        name='trade-params__multiplier-radio'
                        items={cancellation_range_list.map(({ text, value }) => ({
                            id: text,
                            label: text,
                            value: value.toString(),
                        }))}
                        selected={cancellation_duration}
                        onToggle={event => onChangeCancellationDuration({ event, onChangeMultiple })}
                    />
                </React.Fragment>
            )}
        </Fieldset>
    );
};

export default connect(({ modules }) => ({
    has_cancellation: modules.trade.has_cancellation,
    onChangeMultiple: modules.trade.onChangeMultiple,
    cancellation_duration: modules.trade.cancellation_duration,
    cancellation_range_list: modules.trade.cancellation_range_list,
}))(CancelDeal);
