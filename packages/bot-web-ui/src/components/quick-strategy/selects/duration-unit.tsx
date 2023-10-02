import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';

type TSymbolRaw = {
    display: string;
    unit: string;
    min: number;
    max: number;
};

type TSymbol = {
    text: string;
    value: string;
    min: number;
    max: number;
};

type TDurationUnit = {
    value?: string;
    data: {
        symbol?: string;
        trade_type?: string;
    };
    onChange?: ({ duration_unit }: { duration_unit: string }) => void;
    fullwidth?: boolean;
};

const DurationUnit: React.FC<TDurationUnit> = ({ value, onChange, data, fullwidth = false }) => {
    const [selected, setSelected] = React.useState(value);
    const [list, setList] = React.useState<TSymbol[]>([]);
    const { symbol, trade_type } = data;

    React.useEffect(() => {
        if (trade_type && symbol) {
            const getDurationUnits = async () => {
                const { contracts_for } = ApiHelpers.instance;
                const durations = await contracts_for.getDurations(symbol, trade_type);
                const duration_units = durations?.map((duration: TSymbolRaw) => ({
                    text: duration.display,
                    value: duration.unit,
                    min: duration.min,
                    max: duration.max,
                }));
                setList(duration_units);
                const has_selected = durations?.some((duration: TSymbol) => duration.value === selected);
                if (!has_selected && durations?.[0]?.unit !== selected) handleChange(durations[0].unit);
            };
            getDurationUnits();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, trade_type]);

    const handleChange = (value: string) => {
        if (value && value !== selected) {
            setSelected(value);
            onChange?.({ duration_unit: value });
        }
    };

    const selected_item = list?.find(item => item.value === selected);

    return (
        <div className={classNames('qs__form__field', { 'full-width': fullwidth })}>
            <Field name='asset' key='asset' id='asset'>
                {({ field }: FieldProps<string, TFormValues>) => (
                    <Autocomplete
                        {...field}
                        autoComplete='off'
                        className='qs__select'
                        value={selected_item?.text || ''}
                        list_items={list}
                        onItemSelection={(item: TItem) => {
                            handleChange((item as TSymbol)?.value as string);
                        }}
                    />
                )}
            </Field>
        </div>
    );
};

export default DurationUnit;
