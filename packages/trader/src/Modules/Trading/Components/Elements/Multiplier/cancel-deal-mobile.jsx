import React from 'react';
import { Checkbox, RadioGroup } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { onToggleCancellation, onChangeCancellationDuration } from 'Stores/Modules/Contract/Helpers/multiplier';
import Fieldset from 'App/Components/Form/fieldset.jsx';

const CancelDeal = ({ has_cancellation, onChangeMultiple, cancellation_duration, cancellation_range_list }) => {
    return (
        <Fieldset className='trade-container__fieldset'>
            <Checkbox
                id='dt_cancellation-checkbox_input'
                onChange={() => onToggleCancellation({ has_cancellation, onChangeMultiple })}
                name='has_cancellation'
                label={localize('Deal cancellation')}
                defaultChecked={has_cancellation}
            />
            {has_cancellation && (
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
