import React from 'react';
import debounce from 'lodash.debounce';
import { ActionSheet, Text, WheelPicker } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { getGrowthRatePercentage } from '@deriv/shared';
import { Skeleton } from '@deriv/components';
import type { TV2ParamsInitialValues } from 'Stores/Modules/Trading/trade-store';

type TGrowthRatePickerProps = {
    accumulator_range_list?: number[];
    growth_rate: number;
    maximum_ticks: number;
    setGrowthRate: (growth_rate: number) => void;
    setV2ParamsInitialValues: ({ value, name }: { value: number | string; name: keyof TV2ParamsInitialValues }) => void;
    should_show_details?: boolean;
    tick_size_barrier_percentage: string;
};

const debouncedSetGrowthRate = debounce((setGrowthRate, growth_rate) => {
    setGrowthRate(growth_rate);
}, 200);

const GrowthRatePicker = ({
    accumulator_range_list = [],
    growth_rate,
    maximum_ticks,
    setGrowthRate,
    setV2ParamsInitialValues,
    should_show_details,
    tick_size_barrier_percentage,
}: TGrowthRatePickerProps) => {
    const initial_growth_rate = React.useRef<number>();
    const selected_growth_rate = React.useRef<number>(growth_rate);
    const data = accumulator_range_list.map(rate => ({ value: `${getGrowthRatePercentage(rate)}%` }));
    const details_content = [
        {
            label: <Localize i18n_default_text='Barrier' />,
            value: `±${tick_size_barrier_percentage}`,
        },
        {
            label: <Localize i18n_default_text='Max duration' />,
            value: `${maximum_ticks || 0} ${maximum_ticks === 1 ? localize('tick') : localize('ticks')}`,
        },
    ];

    React.useEffect(() => {
        if (!initial_growth_rate.current && growth_rate) {
            initial_growth_rate.current = growth_rate;
            setV2ParamsInitialValues({ value: growth_rate, name: 'growth_rate' });
        }
        return () => {
            if (initial_growth_rate.current && initial_growth_rate.current !== selected_growth_rate.current) {
                setGrowthRate(initial_growth_rate.current);
            }
            debouncedSetGrowthRate.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = () => {
        initial_growth_rate.current = selected_growth_rate.current;
        setV2ParamsInitialValues({ value: selected_growth_rate.current, name: 'growth_rate' });
    };

    const handlePickerValuesChange = (value: string | number) => {
        const new_value = Number((value as string).slice(0, -1)) / 100;
        if (new_value === selected_growth_rate.current) return;
        debouncedSetGrowthRate(setGrowthRate, new_value);
        selected_growth_rate.current = new_value;
    };

    return (
        <React.Fragment>
            <ActionSheet.Content className='growth-rate__picker'>
                <div className='growth-rate__wheel-picker'>
                    {accumulator_range_list.length ? (
                        <WheelPicker
                            data={data}
                            selectedValue={`${getGrowthRatePercentage(selected_growth_rate.current)}%`}
                            setSelectedValue={handlePickerValuesChange}
                        />
                    ) : (
                        <Skeleton />
                    )}
                </div>
                <div className='growth-rate__details'>
                    {details_content.map(({ label, value }) => (
                        <span key={value} className='growth-rate__details-item'>
                            <Text color='quill-typography__color--subtle' size='sm'>
                                {label}
                            </Text>
                            <div className='growth-rate__details-item-value'>
                                {should_show_details ? (
                                    <Text size='sm'>{value}</Text>
                                ) : (
                                    <Skeleton height={14} width={75} />
                                )}
                            </div>
                        </span>
                    ))}
                </div>
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: handleSave,
                }}
            />
        </React.Fragment>
    );
};

export default GrowthRatePicker;
