import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import TakeProfitInput from '../TakeProfit/take-profit-input';

type TTakeProfitAndStopLossProps = {
    closeActionSheet: () => void;
    should_show_deal_cancellation?: boolean;
};

//TODO: add restoring values from wheel-p-initial-v
const TakeProfitAndStopLoss = observer(({ closeActionSheet }: TTakeProfitAndStopLossProps) => {
    const {
        // contract_type,
        has_take_profit,
        take_profit,
        // trade_types,
        // trade_type_tab,
        onChangeMultiple,
        onChange,
        // setWheelPickerInitialValues,
        validation_errors,
    } = useTraderStore();

    const [is_save_btn_clicked, setIsSaveBtnClicked] = React.useState(false);

    const has_tp_initial_value_ref_parent = React.useRef<boolean>();
    const tp_initial_value_ref_parent = React.useRef<string | number | undefined>('');
    const be_error_text = validation_errors.take_profit[0];

    const onSave = () => {
        setIsSaveBtnClicked(true);
        if (be_error_text && has_take_profit) {
            return;
        }

        if (has_take_profit !== has_tp_initial_value_ref_parent.current) {
            has_tp_initial_value_ref_parent.current = has_take_profit;
        }
        if (take_profit !== tp_initial_value_ref_parent.current) {
            tp_initial_value_ref_parent.current = take_profit;
        }

        const has_take_profit_1 = be_error_text ? false : has_take_profit;
        onChangeMultiple({
            has_take_profit: has_take_profit_1,
            ...(has_take_profit_1 ? { has_cancellation: false } : {}),
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
            <TakeProfitInput
                classname='risk-management__tp-sl'
                has_save_button={false}
                onActionSheetClose={closeActionSheet}
                has_tp_initial_value_ref_parent={has_tp_initial_value_ref_parent}
                tp_initial_value_ref_parent={tp_initial_value_ref_parent}
                is_parent_save_btn_clicked={is_save_btn_clicked}
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

export default TakeProfitAndStopLoss;
