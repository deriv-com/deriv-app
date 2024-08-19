import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button, useSnackbar } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { getSnackBarText } from 'AppV2/Utils/trade-params-utils';
import TakeProfitAndStopLossInput from './take-profit-and-stop-loss-input';

type TTakeProfitAndStopLossContainerProps = {
    closeActionSheet: () => void;
    should_show_deal_cancellation?: boolean;
};

//TODO: add restoring values from wheel-p-initial-v
const TakeProfitAndStopLossContainer = observer(({ closeActionSheet }: TTakeProfitAndStopLossContainerProps) => {
    const {
        has_take_profit,
        has_cancellation,
        has_stop_loss,
        take_profit,
        onChangeMultiple,
        onChange,
        stop_loss,
        validation_errors,
    } = useTraderStore();
    const { addSnackbar } = useSnackbar();

    const [is_save_btn_clicked, setIsSaveBtnClicked] = React.useState(false);

    // All initial values are used to restore correct values if user closed ActionSheet without Saving or refreshed the page
    const has_tp_initial_value_ref = React.useRef<boolean>();
    const tp_initial_value_ref = React.useRef<string | number | undefined>('');
    const has_sl_initial_value_ref = React.useRef<boolean>();
    const sl_initial_value_ref = React.useRef<string | number | undefined>('');

    const tp_be_error_text = validation_errors.take_profit[0];
    const sl_be_error_text = validation_errors.stop_loss[0];

    const onSave = () => {
        setIsSaveBtnClicked(true);

        if ((tp_be_error_text && has_take_profit) || (sl_be_error_text && has_stop_loss)) return;

        // Initial values are set on Mount and been updated on Save
        if (has_take_profit !== has_tp_initial_value_ref.current) {
            has_tp_initial_value_ref.current = has_take_profit;
        }
        if (take_profit !== tp_initial_value_ref.current) {
            tp_initial_value_ref.current = take_profit;
        }
        if (has_stop_loss !== has_sl_initial_value_ref.current) {
            has_sl_initial_value_ref.current = has_stop_loss;
        }
        if (stop_loss !== sl_initial_value_ref.current) {
            sl_initial_value_ref.current = stop_loss;
        }

        const is_tp_enabled = tp_be_error_text ? false : has_take_profit;
        const is_sl_enabled = sl_be_error_text ? false : has_stop_loss;

        if ((is_tp_enabled || is_sl_enabled) && has_cancellation) {
            addSnackbar({
                message: getSnackBarText({
                    has_cancellation,
                    has_stop_loss: is_sl_enabled,
                    has_take_profit: is_tp_enabled,
                    switching_TP_SL: true,
                }),
                hasCloseButton: true,
                delay: 100,
            });
        }

        // We should switch off DC if TP or SL is on and vice versa
        onChangeMultiple({
            has_take_profit: is_tp_enabled,
            has_stop_loss: is_sl_enabled,
            ...(is_tp_enabled || is_sl_enabled ? { has_cancellation: false } : {}),
        });

        onChange({
            target: {
                name: 'take_profit',
                value: tp_be_error_text || take_profit === '0' ? '' : take_profit,
            },
        });

        onChange({
            target: {
                name: 'stop_loss',
                value: sl_be_error_text || stop_loss === '0' ? '' : stop_loss,
            },
        });

        closeActionSheet();
    };

    return (
        <div className='risk-management__tp-sl__wrapper'>
            <TakeProfitAndStopLossInput
                classname='risk-management__tp-sl'
                has_save_button={false}
                has_initial_value_parent_ref={has_tp_initial_value_ref}
                is_save_btn_clicked={is_save_btn_clicked}
                initial_value_parent_ref={tp_initial_value_ref}
                onActionSheetClose={closeActionSheet}
                should_wrap_with_actionsheet={false}
                show_acceptable_range={false}
                key='take_profit'
            />
            <TakeProfitAndStopLossInput
                classname='risk-management__tp-sl'
                has_save_button={false}
                has_initial_value_parent_ref={has_sl_initial_value_ref}
                is_save_btn_clicked={is_save_btn_clicked}
                initial_value_parent_ref={sl_initial_value_ref}
                onActionSheetClose={closeActionSheet}
                type='stop_loss'
                should_wrap_with_actionsheet={false}
                show_acceptable_range={false}
                key='stop_loss'
            />
            <Button
                color='black'
                size='lg'
                label={<Localize i18n_default_text='Save' />}
                fullWidth
                className='risk-management__save-button'
                onClick={onSave}
            />
        </div>
    );
});

export default TakeProfitAndStopLossContainer;
