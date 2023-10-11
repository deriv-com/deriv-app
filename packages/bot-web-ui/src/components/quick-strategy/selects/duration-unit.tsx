import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';

import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';

import { useDBotStore } from 'Stores/useDBotStore';

import { TDurationItemRaw } from '../types';

type TDurationUnitItem = {
    text: string;
    value: string;
    min: number;
    max: number;
};

type TDurationUnit = {
    selected?: string;
    data: {
        symbol?: string;
        trade_type?: string;
    };
    fullWidth?: boolean;
    attached?: boolean;
};

const DurationUnit: React.FC<TDurationUnit> = ({ selected, data, fullWidth = false, attached }) => {
    const [list, setList] = React.useState<TDurationUnitItem[]>([]);
    const { symbol, trade_type } = data;
    const { quick_strategy_store_1 } = useDBotStore();
    const { setValue } = quick_strategy_store_1;
    const { setFieldValue } = useFormikContext();

    React.useEffect(() => {
        if (trade_type && symbol) {
            const getDurationUnits = async () => {
                const { contracts_for } = ApiHelpers.instance;
                const durations = await contracts_for.getDurations(symbol, trade_type);
                const duration_units = durations?.map((duration: TDurationItemRaw) => ({
                    text: duration.display,
                    value: duration.unit,
                    min: duration.min,
                    max: duration.max,
                }));
                setList(duration_units);
                const has_selected = duration_units?.some((duration: TDurationUnitItem) => duration.value === selected);
                if (!has_selected) {
                    setFieldValue?.('duration_unit', durations[0].unit);
                }
            };
            getDurationUnits();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, trade_type]);

    return (
        <div
            className={classNames('qs__form__field', {
                'full-width': fullWidth,
                'no-top-border-radius': attached,
            })}
        >
            <Field name='duration_unit' key='duration_unit' id='duration_unit'>
                {({ field }: FieldProps) => {
                    const selected_item = list?.find(item => item.value === field.value);
                    return (
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            className='qs__select'
                            value={selected_item?.text || ''}
                            list_items={list}
                            onItemSelection={(item: TItem) => {
                                if (item?.value) {
                                    setFieldValue?.('duration_unit', (item as TDurationUnitItem)?.value as string);
                                    setValue('duration_unit', (item as TDurationUnitItem)?.value as string);
                                }
                            }}
                        />
                    );
                }}
            </Field>
        </div>
    );
};

export default DurationUnit;
