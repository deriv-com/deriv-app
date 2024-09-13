import React from 'react';
import debounce from 'lodash.debounce';
import { ActionSheet, Text, WheelPicker } from '@deriv-com/quill-ui';
import { Skeleton } from '@deriv/components';
import { Localize } from '@deriv/translations';
import type { TV2ParamsInitialValues } from 'Stores/Modules/Trading/trade-store';

type TPayoutPerPointWheelProps = {
    barrier?: string | number;
    current_payout_per_point: string;
    onPayoutPerPointSelect: (new_value: string | number) => void;
    payout_per_point_list: {
        value: string;
    }[];
    setV2ParamsInitialValues: ({ value, name }: { value: number | string; name: keyof TV2ParamsInitialValues }) => void;
};

const onWheelPickerScrollDebounced = debounce(
    (new_value: string | number, callback: TPayoutPerPointWheelProps['onPayoutPerPointSelect']) => callback(new_value),
    200
);

const PayoutPerPointWheel = ({
    barrier,
    current_payout_per_point,
    onPayoutPerPointSelect,
    setV2ParamsInitialValues,
    payout_per_point_list,
}: TPayoutPerPointWheelProps) => {
    const initial_value_ref = React.useRef<string | number>();
    const selected_value_ref = React.useRef<string | number>(current_payout_per_point);

    const onSave = () => {
        initial_value_ref.current = selected_value_ref.current;
        setV2ParamsInitialValues({ value: selected_value_ref.current, name: 'payout_per_point' });
    };

    React.useEffect(() => {
        if (!initial_value_ref.current && current_payout_per_point) {
            initial_value_ref.current = current_payout_per_point;
            setV2ParamsInitialValues({ value: current_payout_per_point, name: 'payout_per_point' });
        }

        return () => {
            if (initial_value_ref.current && initial_value_ref.current !== selected_value_ref.current) {
                onPayoutPerPointSelect(initial_value_ref.current);
            }
            onWheelPickerScrollDebounced.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <ActionSheet.Content className='payout-per-point__wrapper' data-testid='dt_payout-per-point_wrapper'>
                <div className='payout-per-point__wheel-picker'>
                    <WheelPicker
                        data={payout_per_point_list}
                        selectedValue={selected_value_ref.current}
                        setSelectedValue={(new_value: string | number) => {
                            if (new_value === selected_value_ref.current) return;
                            selected_value_ref.current = new_value;
                            onWheelPickerScrollDebounced(new_value, onPayoutPerPointSelect);
                        }}
                    />
                </div>
                <div className='payout-per-point__barrier'>
                    <Text color='quill-typography__color--subtle' size='sm'>
                        <Localize i18n_default_text='Barrier' />
                    </Text>
                    <Text size='sm' as='div' className='payout-per-point__barrier__content'>
                        {barrier ?? <Skeleton width={90} height={14} />}
                    </Text>
                </div>
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: onSave,
                }}
            />
        </React.Fragment>
    );
};

export default PayoutPerPointWheel;
