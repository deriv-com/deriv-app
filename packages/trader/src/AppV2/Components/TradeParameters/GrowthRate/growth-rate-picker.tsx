import React from 'react';
import clsx from 'clsx';
import { ActionSheet, Text, WheelPickerContainer } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { getGrowthRatePercentage } from '@deriv/shared';

type TGrowthRatePickerProps = {
    accumulator_range_list?: number[];
    growth_rate: number;
    is_small_screen?: boolean;
    maximum_ticks: number;
    onSave: () => void;
    setGrowthRate: (growth_rate: number) => void;
    tick_size_barrier_percentage: string;
};

const GrowthRatePicker = ({
    accumulator_range_list = [],
    growth_rate,
    is_small_screen,
    maximum_ticks,
    onSave,
    setGrowthRate,
    tick_size_barrier_percentage,
}: TGrowthRatePickerProps) => {
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

    if (!accumulator_range_list.length) return null;
    return (
        <React.Fragment>
            <ActionSheet.Content
                className={clsx('growth-rate__content', is_small_screen && 'growth-rate__content--small')}
            >
                <div className='growth-rate__picker'>
                    <WheelPickerContainer
                        data={[data]}
                        inputValues={[`${getGrowthRatePercentage(growth_rate)}%`]}
                        setInputValues={(_idx, value) => setGrowthRate(Number((value as string).slice(0, -1)) / 100)}
                    />
                </div>
                <div className='growth-rate__details'>
                    {details_content.map(({ label, value }) => (
                        <span key={value} className='growth-rate__details-item'>
                            <Text size='sm'>{label}</Text>
                            <Text size='sm'>{value}</Text>
                        </span>
                    ))}
                </div>
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: onSave,
                }}
                shouldCloseOnPrimaryButtonClick={false}
            />
        </React.Fragment>
    );
};

export default GrowthRatePicker;
