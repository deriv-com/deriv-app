import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, IconTradeTypes, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useDBotStore } from 'Stores/useDBotStore';

type TTradeType = {
    component?: React.ReactNode;
    text: string;
    value: string;
    group: string;
    icon: string[];
};

type TTradeTypeOption = {
    trade_type: TTradeType;
};

const TradeTypeOption: React.FC<TTradeTypeOption> = ({ trade_type }) => (
    <div key={trade_type.value} className='qs__select__option'>
        <IconTradeTypes type={trade_type.icon[0]} className='qs__select__option__icon' />
        <IconTradeTypes type={trade_type.icon[1]} className='qs__select__option__icon' />
        <Text className='qs__select__option__text' size='xs' color='prominent'>
            {trade_type.text}
        </Text>
    </div>
);

type TTradeTypeSelect = {
    symbol?: string;
    fullWidth?: boolean;
    selected?: string;
};

const TradeTypeSelect: React.FC<TTradeTypeSelect> = ({ symbol, selected, fullWidth = false }) => {
    const [trade_types, setTradeTypes] = React.useState([]);
    const { setFieldValue } = useFormikContext();
    const { quick_strategy } = useDBotStore();
    const { setValue } = quick_strategy;

    React.useEffect(() => {
        if (symbol) {
            const { contracts_for } = ApiHelpers.instance;
            const getTradeTypes = async () => {
                const trade_types = await contracts_for.getTradeTypesForQuickStrategy(symbol);
                setTradeTypes(trade_types);

                const has_selected = trade_types?.some((trade_type: TTradeType) => trade_type.value === selected);
                if (!has_selected && trade_types?.[0]?.value !== selected) {
                    setFieldValue?.('tradetype', trade_types?.[0].value);
                    setValue('tradetype', trade_types?.[0].value);
                }
            };
            getTradeTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol]);

    const trade_type_dropdown_options = React.useMemo(
        () =>
            trade_types.map((trade_type: TTradeType) => ({
                component: <TradeTypeOption key={trade_type.text} trade_type={trade_type} />,
                ...trade_type,
            })),
        [trade_types]
    );

    return (
        <div className={classNames('qs__form__field', { 'full-width': fullWidth })}>
            <Field name='tradetype' key='tradetype' id='tradetype'>
                {({ field }: FieldProps) => {
                    const selected_trade_type = trade_type_dropdown_options?.find(
                        trade_type => trade_type.value === field.value
                    );
                    return (
                        <Autocomplete
                            {...field}
                            inputMode='none'
                            data-testid='qs_autocomplete_tradetype'
                            autoComplete='off'
                            className='qs__autocomplete'
                            value={selected_trade_type?.text || ''}
                            list_items={trade_type_dropdown_options}
                            onItemSelection={(item: TItem) => {
                                if (item?.value) {
                                    setFieldValue?.('tradetype', (item as TTradeType)?.value as string);
                                    setValue('tradetype', (item as TTradeType)?.value as string);
                                }
                            }}
                            leading_icon={
                                <Text>
                                    <IconTradeTypes type={selected_trade_type?.icon?.[0] || 'CALL'} />
                                    <IconTradeTypes type={selected_trade_type?.icon?.[1] || 'PUT'} />
                                </Text>
                            }
                        />
                    );
                }}
            </Field>
        </div>
    );
};

export default TradeTypeSelect;
