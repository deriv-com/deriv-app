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
        tradetype?: string;
    };
    fullWidth?: boolean;
    attached?: boolean;
};

const DurationUnit: React.FC<TDurationUnit> = ({ selected, data, fullWidth = false, attached }) => {
    const [list, setList] = React.useState<TDurationUnitItem[]>([]);
    const { symbol, tradetype } = data;
    const { quick_strategy } = useDBotStore();
    const { setValue } = quick_strategy;
    const { setFieldValue, validateForm } = useFormikContext();

    React.useEffect(() => {
        if (tradetype && symbol) {
            const getDurationUnits = async () => {
                const { contracts_for } = ApiHelpers.instance;
                const durations = await contracts_for.getDurations(symbol, tradetype);
                const duration_units = durations?.map((duration: TDurationItemRaw) => ({
                    text: duration.display,
                    value: duration.unit,
                    min: duration.min,
                    max: duration.max,
                }));
                setList(duration_units);
                const has_selected = duration_units?.some((duration: TDurationUnitItem) => duration.value === selected);
                if (!has_selected) {
                    setFieldValue?.('durationtype', durations?.[0]?.unit);
                    setFieldValue?.('duration', durations?.[0]?.min).then(() => {
                        validateForm();
                    });
                    setValue('durationtype', durations?.[0]?.unit);
                }
            };
            getDurationUnits();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, tradetype]);

    return (
        <div
            className={classNames('qs__form__field', {
                'full-width': fullWidth,
                'no-top-border-radius': attached,
            })}
        >
            <Field name='durationtype' key='durationtype' id='durationtype'>
                {({ field }: FieldProps) => {
                    const selected_item = list?.find(item => item.value === field.value);
                    return (
                        <Autocomplete
                            {...field}
                            inputMode='none'
                            data-testid='qs_autocomplete_durationtype'
                            autoComplete='off'
                            className='qs__select'
                            value={selected_item?.text || ''}
                            list_items={list}
                            onItemSelection={(item: TItem) => {
                                if (item?.value) {
                                    setFieldValue?.('durationtype', (item as TDurationUnitItem)?.value as string);
                                    setValue('durationtype', (item as TDurationUnitItem)?.value as string);
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
