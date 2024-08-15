import React from 'react';
import debounce from 'lodash.debounce';
import { ActionSheet, Text, WheelPicker } from '@deriv-com/quill-ui';
import { Skeleton } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TStrikeWheelProps = {
    current_strike: string;
    currency: string;
    onStrikePriceSelect: (e: {
        target: {
            name: string;
            value: unknown;
        };
    }) => void;
    payout_per_point?: string | number;
    strike_price_list: {
        value: string;
    }[];
};

const onWheelPickerScrollDebounced = debounce(
    (new_value: string | number, callback: TStrikeWheelProps['onStrikePriceSelect']) => {
        callback({ target: { name: 'barrier_1', value: new_value } });
    },
    200
);

const StrikeWheel = ({
    current_strike,
    currency,
    onStrikePriceSelect,
    payout_per_point,
    strike_price_list,
}: TStrikeWheelProps) => {
    const initial_value_ref = React.useRef<string | number>();
    const selected_value_ref = React.useRef<string | number>(current_strike);

    const onSave = () => {
        if (selected_value_ref.current !== initial_value_ref.current) {
            initial_value_ref.current = selected_value_ref.current;
        }
    };

    React.useEffect(() => {
        if (!initial_value_ref.current && current_strike) {
            initial_value_ref.current = current_strike;
        }

        return () => {
            if (initial_value_ref.current !== selected_value_ref.current) {
                onStrikePriceSelect({ target: { name: 'barrier_1', value: initial_value_ref.current } });
            }
            onWheelPickerScrollDebounced.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <ActionSheet.Content className='strike__wrapper' data-testid='dt_strike_wrapper'>
                <div className='strike__wheel-picker'>
                    <WheelPicker
                        data={strike_price_list}
                        selectedValue={selected_value_ref.current}
                        setSelectedValue={(new_value: string | number) => {
                            if (new_value === selected_value_ref.current) return;
                            selected_value_ref.current = new_value;
                            onWheelPickerScrollDebounced(new_value, onStrikePriceSelect);
                        }}
                    />
                </div>
                <div className='strike__payout'>
                    <Text color='quill-typography__color--subtle' size='sm'>
                        <Localize i18n_default_text='Payout per point:' />
                    </Text>
                    <Text size='sm' as='div' className='strike__payout__content'>
                        {payout_per_point ? (
                            <React.Fragment>
                                {payout_per_point} {currency}
                            </React.Fragment>
                        ) : (
                            <Skeleton width={90} height={14} />
                        )}
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

export default StrikeWheel;
