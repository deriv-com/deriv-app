import React from 'react';
import { Checkbox, RadioGroup, Dialog, Popover, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { onToggleCancellation, onChangeCancellationDuration } from 'Stores/Modules/Trading/Helpers/multiplier';
import Fieldset from 'App/Components/Form/fieldset';
import { observer, useStore } from '@deriv/stores';
import { TTradeStore } from 'Types';
import { useTraderStore } from 'Stores/useTraderStores';

type TDealCancellationWarningDialog = {
    is_visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

type TCancelDeal = {
    has_cancellation: boolean;
    has_take_profit: boolean;
    has_stop_loss: boolean;
    onChangeMultiple: (
        props: Partial<
            Pick<
                TTradeStore,
                | 'cancellation_duration'
                | 'has_cancellation'
                | 'has_stop_loss'
                | 'has_take_profit'
                | 'stop_loss'
                | 'take_profit'
            >
        >
    ) => void;
    cancellation_duration: string;
};

const DealCancellationWarningDialog = observer(
    ({ is_visible, onConfirm, onCancel }: TDealCancellationWarningDialog) => {
        const { ui } = useStore();
        const { disableApp, enableApp, should_show_cancellation_warning, toggleCancellationWarning } = ui;
        return (
            <Dialog
                className='trade-params__multiplier-deal-cancellation-dialog'
                title={localize('About deal cancellation')}
                confirm_button_text={localize('Got it')}
                cancel_button_text={localize('Cancel')}
                onConfirm={onConfirm}
                onCancel={onCancel}
                is_mobile_full_width={false}
                is_visible={is_visible}
                disableApp={disableApp}
                enableApp={enableApp}
                portal_element_id='modal_root'
            >
                <Text size='xxxs' color='general'>
                    <Localize i18n_default_text='Take profit and/or stop loss are not available while deal cancellation is active.' />
                </Text>
                <Checkbox
                    defaultChecked={!should_show_cancellation_warning}
                    onChange={() => toggleCancellationWarning()}
                    name='should_show_cancellation_warning'
                    label={localize("Don't show this again")}
                />
            </Dialog>
        );
    }
);

const CancelDeal = observer(
    ({ has_cancellation, has_take_profit, has_stop_loss, onChangeMultiple, cancellation_duration }: TCancelDeal) => {
        const { ui } = useStore();
        const { should_show_cancellation_warning } = ui;
        const { cancellation_range_list } = useTraderStore();
        const [is_deal_cancel_warning_visible, setDealCancelWarningVisibility] = React.useState(false);

        const canToggleDealCancel = () => {
            const should_show_popover = (has_take_profit || has_stop_loss) && should_show_cancellation_warning;
            if (should_show_popover) setDealCancelWarningVisibility(should_show_popover);
            return !should_show_popover;
        };

        return (
            <React.Fragment>
                <DealCancellationWarningDialog
                    is_visible={is_deal_cancel_warning_visible}
                    onCancel={() => setDealCancelWarningVisibility(false)}
                    onConfirm={() => {
                        setDealCancelWarningVisibility(false);
                        onToggleCancellation({ has_cancellation, onChangeMultiple });
                    }}
                />
                <Fieldset className='trade-container__fieldset'>
                    <div className='dc-input-wrapper--inline'>
                        <Checkbox
                            id='dt_cancellation-checkbox_input'
                            onChange={() => {
                                if (canToggleDealCancel()) {
                                    onToggleCancellation({ has_cancellation, onChangeMultiple });
                                }
                            }}
                            name='has_cancellation'
                            label={localize('Deal cancellation')}
                            defaultChecked={has_cancellation}
                        />
                        <Popover
                            alignment='left'
                            icon='info'
                            id='dt_multiplier-stake__tooltip'
                            is_bubble_hover_enabled
                            classNameBubble='trade-container__deal-cancellation-popover'
                            zIndex='9999'
                            message={localize(
                                'When this is active, you can cancel your trade within the chosen time frame. Your stake will be returned without loss.'
                            )}
                        />
                    </div>
                    {has_cancellation && (
                        <React.Fragment>
                            <RadioGroup
                                className='trade-params__multiplier-radio-group'
                                name='trade-params__multiplier-radio'
                                selected={cancellation_duration}
                                onToggle={event => onChangeCancellationDuration({ event, onChangeMultiple })}
                            >
                                {cancellation_range_list.map(({ text, value }) => (
                                    <RadioGroup.Item key={value} id={text} label={text} value={value.toString()} />
                                ))}
                            </RadioGroup>
                        </React.Fragment>
                    )}
                </Fieldset>
            </React.Fragment>
        );
    }
);

export default CancelDeal;
