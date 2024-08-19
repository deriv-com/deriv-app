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
        // contract_type,
        has_take_profit,
        has_cancellation,
        has_stop_loss,
        take_profit,
        // trade_types,
        // trade_type_tab,
        onChangeMultiple,
        onChange,
        // setWheelPickerInitialValues,
        validation_errors,
    } = useTraderStore();
    const { addSnackbar } = useSnackbar();

    const [is_save_btn_clicked, setIsSaveBtnClicked] = React.useState(false);

    // All initial values are used to restore correct values if user closed ActionSheet without Saving or refreshed the page
    const has_tp_initial_value_ref = React.useRef<boolean>();
    const tp_initial_value_ref = React.useRef<string | number | undefined>('');

    const be_error_text = validation_errors.take_profit[0];

    const onSave = () => {
        setIsSaveBtnClicked(true);

        if (be_error_text && has_take_profit) return;

        // Initial values are set on Mount and been updated on Save
        if (has_take_profit !== has_tp_initial_value_ref.current) {
            has_tp_initial_value_ref.current = has_take_profit;
        }
        if (take_profit !== tp_initial_value_ref.current) {
            tp_initial_value_ref.current = take_profit;
        }

        const is_tp_enabled = be_error_text ? false : has_take_profit;

        if (is_tp_enabled && has_cancellation) {
            addSnackbar({
                message: getSnackBarText({
                    has_cancellation,
                    has_stop_loss,
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
            ...(is_tp_enabled ? { has_cancellation: false } : {}),
        });

        onChange({
            target: {
                name: 'take_profit',
                value: be_error_text || take_profit === '0' ? '' : take_profit,
            },
        });

        closeActionSheet();
    };
    return (
        <div className='risk-management__tp-sl__wrapper'>
            {/* <div> */}
            <TakeProfitAndStopLossInput
                classname='risk-management__tp-sl'
                has_save_button={false}
                has_tp_initial_value_parent_ref={has_tp_initial_value_ref}
                is_save_btn_clicked={is_save_btn_clicked}
                onActionSheetClose={closeActionSheet}
                tp_initial_value_parent_ref={tp_initial_value_ref}
            />
            <div>SL</div>
            {/* </div> */}
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
