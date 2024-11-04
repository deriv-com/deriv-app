import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Autocomplete } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useDBotStore } from 'Stores/useDBotStore';
import { TDurationUnitItem, TFormData } from '../types';

type TDurationUnit = {
    attached?: boolean;
};

const SellConditions: React.FC<TDurationUnit> = ({ attached }: TDurationUnit) => {
    const [list, setList] = React.useState<TDurationUnitItem[]>([]);
    const { quick_strategy } = useDBotStore();
    const { setValue } = quick_strategy;
    const { values, setFieldValue } = useFormikContext<TFormData>();

    React.useEffect(() => {
       const sell_conditions = [
           { text: 'Take Profit', value: 'take_profit' },
           { text: 'Tick Count', value: 'tick_count' },
       ];
       setList(sell_conditions);
    }, []);

    return (
        <div
            className={classNames('qs__form__field qs__form__field__input', {
                'no-top-border-radius': attached,
            })}
        >
            <Field name='sell_conditions' key='sell_conditions' id='sell_conditions'>
                {({ field }: FieldProps) => {
                    const selected_item = list?.find(item => item.value === field.value);
                    return (
                        <Autocomplete
                            {...field}
                            readOnly
                            inputMode='none'
                            data-testid='dt_qs_sell_conditions'
                            autoComplete='off'
                            className='qs__select'
                            value={selected_item?.text || ''}
                            list_items={list}
                            onItemSelection={(item: TItem) => {
                                const { value } = item as TDurationUnitItem;
                                if (value) {
                                    setValue('sell_conditions', value);
                                    setFieldValue?.('sell_conditions', value);
                                }
                            }}
                        />
                    );
                }}
            </Field>
        </div>
    );
};

export default SellConditions;
