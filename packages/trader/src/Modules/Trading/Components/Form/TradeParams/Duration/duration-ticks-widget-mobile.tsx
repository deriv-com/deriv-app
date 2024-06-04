import React from 'react';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { updateAmountChanges } from './duration-utils';
import { getDurationMinMaxValues, isEmptyObject } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TickPicker } from '@deriv/components';
import { TDurationMobile } from './duration-mobile';

type TNumber = Pick<
    TDurationMobile,
    | 'expiry_epoch'
    | 'has_amount_error'
    | 'payout_value'
    | 'setDurationError'
    | 'setSelectedDuration'
    | 'stake_value'
    | 'toggleModal'
> & {
    basis_option: string;
    contract_expiry?: string;
    duration_unit_option: ReturnType<typeof useTraderStore>['duration_units_list'][0];
    duration_values?: Record<string, number>;
    selected_duration: number;
    show_expiry?: boolean;
};

type TDurationTicksWidgetMobile = Omit<
    TNumber,
    'expiry_epoch' | 'contract_expiry' | 'duration_unit_option' | 'show_expiry'
>;
const DurationTicksWidgetMobile = observer(
    ({
        setDurationError,
        basis_option,
        toggleModal,
        has_amount_error,
        payout_value,
        stake_value,
        selected_duration,
        setSelectedDuration,
    }: TDurationTicksWidgetMobile) => {
        const {
            duration_min_max,
            duration: trade_duration,
            duration_unit: trade_duration_unit,
            basis: trade_basis,
            amount: trade_amount,
            onChangeMultiple,
        } = useTraderStore();

        React.useEffect(() => {
            setDurationError(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const [min_tick, max_tick] = getDurationMinMaxValues(duration_min_max, 'tick', 't');

        const setTickDuration = (value: { target: { value: number; name: string } }) => {
            const { value: duration } = value.target;
            const on_change_obj: Partial<ReturnType<typeof useTraderStore>> = {};

            // check for any amount changes from Amount trade params tab before submitting onChange object
            if (!has_amount_error)
                updateAmountChanges(on_change_obj, stake_value, payout_value, basis_option, trade_basis, trade_amount);

            if (trade_duration !== duration || trade_duration_unit !== 't') {
                on_change_obj.duration_unit = 't';
                on_change_obj.duration = duration;
            }

            if (!isEmptyObject(on_change_obj)) onChangeMultiple(on_change_obj);
            toggleModal();
        };

        const onTickChange = (tick: number) => setSelectedDuration('t', tick);
        const tick_duration =
            trade_duration < Number(min_tick) && selected_duration < Number(min_tick)
                ? Number(min_tick)
                : selected_duration;
        return (
            <div className='trade-params__duration-tickpicker'>
                <TickPicker
                    default_value={tick_duration}
                    submit_label={localize('OK')}
                    max_value={Number(max_tick)}
                    min_value={Number(min_tick)}
                    onSubmit={setTickDuration}
                    onValueChange={onTickChange}
                    singular_label={localize('Tick')}
                    plural_label={localize('Ticks')}
                />
            </div>
        );
    }
);

export default DurationTicksWidgetMobile;
