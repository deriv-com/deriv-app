import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, IconTradeTypes, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';

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

const TradeTypeOption = ({ trade_type }: TTradeTypeOption) => (
    <div key={trade_type.value} className='quick-strategy__option'>
        <IconTradeTypes type={trade_type.icon[0]} className='quick-strategy__icon' />
        <IconTradeTypes type={trade_type.icon[1]} className='quick-strategy__icon' />
        <Text className='quick-strategy__symbol' size='xs' color='prominent'>
            {trade_type.text}
        </Text>
    </div>
);

type TTradeTypeSelect = {
    value?: string;
    symbol?: string;
    onChange?: ({ trade_type }: { trade_type: string }) => void;
    fullwidth?: boolean;
};

const TradeTypeSelect: React.FC<TTradeTypeSelect> = ({ value, symbol, onChange, fullwidth = false }) => {
    const [selected, setSelected] = React.useState(value);
    const [trade_types, setTradeTypes] = React.useState([]);

    React.useEffect(() => {
        if (symbol) {
            const { contracts_for } = ApiHelpers.instance;
            const getTradeTypes = async () => {
                const trade_types = await contracts_for.getTradeTypesForQuickStrategy(symbol);
                setTradeTypes(trade_types);
                const has_selected = trade_types?.some((trade_type: TTradeType) => trade_type.value === selected);

                if (!has_selected && trade_types?.[0]?.value !== selected) handleChange(trade_types[0].value);
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

    const handleChange = (value: string) => {
        if (value && value !== selected) {
            setSelected(value);
            onChange?.({ trade_type: value });
        }
    };

    const selected_trade_type = trade_type_dropdown_options?.find(trade_type => trade_type.value === selected);
    return (
        <div className={classNames('qs__form__field', { 'full-width': fullwidth })}>
            <Field name='asset' key='asset' id='asset'>
                {({ field }: FieldProps<string, TFormValues>) => (
                    <Autocomplete
                        {...field}
                        autoComplete='off'
                        className='qs__autocomplete'
                        value={selected_trade_type?.text || ''}
                        list_items={trade_type_dropdown_options}
                        onItemSelection={(item: TItem) => {
                            handleChange((item as TTradeType)?.value as string);
                        }}
                        leading_icon={
                            <Text>
                                <IconTradeTypes type={selected_trade_type?.icon?.[0] || 'CALL'} />
                                <IconTradeTypes type={selected_trade_type?.icon?.[1] || 'PUT'} />
                            </Text>
                        }
                    />
                )}
            </Field>
        </div>
    );
};

export default TradeTypeSelect;
