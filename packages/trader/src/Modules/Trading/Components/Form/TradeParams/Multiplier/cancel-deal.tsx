import React from 'react';

import { Checkbox, Dropdown, Popover, PopoverMessageCheckbox } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset';
import { onChangeCancellationDuration, onToggleCancellation } from 'Stores/Modules/Trading/Helpers/multiplier';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const CancelDeal = observer(() => {
    const { ui } = useStore();
    const {
        cancellation_range_list,
        cancellation_duration,
        has_cancellation,
        has_stop_loss,
        has_take_profit,
        onChangeMultiple,
    } = useTraderStore();

    const { should_show_cancellation_warning, toggleCancellationWarning } = ui;

    const should_show_popover = (has_take_profit || has_stop_loss) && should_show_cancellation_warning;
    const [is_do_not_show_selected, setDoNotShowSelected] = React.useState(!should_show_cancellation_warning);

    const onPopoverClose = () => {
        if (is_do_not_show_selected) {
            toggleCancellationWarning();
        }
    };

    const onPopoverCheckboxChange = React.useCallback(() => {
        setDoNotShowSelected(prev_state => !prev_state);
    }, []);

    const input = (
        <Checkbox
            id='dt_cancellation-checkbox_input'
            onChange={() => onToggleCancellation({ has_cancellation, onChangeMultiple })}
            name='has_cancellation'
            label={<Localize i18n_default_text='Deal cancellation' />}
            defaultChecked={has_cancellation}
        />
    );

    return (
        <React.Fragment>
            {!!cancellation_range_list.length && (
                <Fieldset className='trade-container__fieldset'>
                    <div className='dc-input-wrapper--inline'>
                        {should_show_popover ? (
                            <Popover
                                alignment='left'
                                classNameBubble='trade-container__popover'
                                is_bubble_hover_enabled
                                margin={2}
                                message={
                                    <PopoverMessageCheckbox
                                        defaultChecked={is_do_not_show_selected}
                                        checkboxLabel={localize("Don't show this again")}
                                        message={localize(
                                            'Take profit and/or stop loss are not available while deal cancellation is active.'
                                        )}
                                        name='should_show_cancellation_warning'
                                        onChange={onPopoverCheckboxChange}
                                    />
                                }
                                onBubbleClose={onPopoverClose}
                                relative_render
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
                            is_bubble_hover_enabled
                            message={localize(
                                'When this is active, you can cancel your trade within the chosen time frame. Your stake will be returned without loss.'
                            )}
                            classNameBubble='trade-container__deal-cancellation-popover'
                            margin={216}
                            relative_render
                        />
                    </div>
                    {has_cancellation && (
                        <Dropdown
                            id='dt_cancellation_range'
                            className='trade-container__multiplier-dropdown'
                            is_alignment_left
                            is_nativepicker={false}
                            list={cancellation_range_list}
                            name='cancellation_duration'
                            no_border={true}
                            value={cancellation_duration}
                            onChange={event => onChangeCancellationDuration({ event, onChangeMultiple })}
                        />
                    )}
                </Fieldset>
            )}
        </React.Fragment>
    );
});

export default CancelDeal;
