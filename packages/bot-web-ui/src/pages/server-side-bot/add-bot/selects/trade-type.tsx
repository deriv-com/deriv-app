import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, IconTradeTypes, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useDBotStore } from 'Stores/useDBotStore';
import { TApiHelpersInstance, TFormData, TTradeType } from '../types';

type TTradeTypeOption = {
    trade_type: TTradeType;
};

const TradeTypeOption: React.FC<TTradeTypeOption> = ({ trade_type: { value, icon, text } }: TTradeTypeOption) => {
    return (
        <div key={value} className='ssb-add__select__option'>
            {icon?.length
                ? icon.map((ic, idx) => (
                      <IconTradeTypes type={ic} className='ssb-add__select__option__icon' key={`${ic}id-${idx}`} />
                  ))
                : null}
            <Text className='ssb-add__select__option__text' size='xs' color='prominent'>
                {text}
            </Text>
        </div>
    );
};

const TradeTypeSelect: React.FC = () => {
    const [trade_types, setTradeTypes] = React.useState<TTradeType[]>([]);
    const { setFieldValue, values, validateForm } = useFormikContext<TFormData>();
    const { server_bot } = useDBotStore();
    const { setValue } = server_bot;

    React.useEffect(() => {
        if (values?.symbol) {
            const selected = values?.tradetype;
            const { contracts_for } = ApiHelpers.instance as unknown as TApiHelpersInstance;
            const getTradeTypes = async () => {
                const trade_types = await contracts_for.getTradeTypesForQuickStrategy(values?.symbol);
                setTradeTypes(trade_types);
                const has_selected = trade_types?.some(trade_type => trade_type.value === selected);
                if (!has_selected && trade_types?.[0]?.value !== selected) {
                    await setFieldValue?.('tradetype', trade_types?.[0].value || '');
                    setValue('tradetype', trade_types?.[0].value);
                }
            };
            getTradeTypes();
            validateForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values?.symbol]);

    const trade_type_dropdown_options = React.useMemo(
        () =>
            trade_types.map(trade_type => ({
                component: <TradeTypeOption key={trade_type.text} trade_type={trade_type} />,
                ...trade_type,
            })),
        [trade_types]
    );

    return (
        <div className='ssb-add__form__field ssb-add__form__field__input ssb-add__form__field__group-icons'>
            <Field name='tradetype' key='tradetype' id='tradetype'>
                {({ field }: FieldProps) => {
                    const selected_trade_type = trade_type_dropdown_options?.find(
                        trade_type => trade_type.value === field.value
                    );
                    return (
                        <Autocomplete
                            {...field}
                            readOnly
                            inputMode='none'
                            data-testid='dt_qs_tradetype'
                            autoComplete='off'
                            className='ssb-add__autocomplete'
                            value={selected_trade_type?.text || ''}
                            list_items={trade_type_dropdown_options}
                            onItemSelection={(item: TItem) => {
                                const value = (item as TTradeType)?.value;
                                const text = (item as TTradeType)?.text;
                                if (value && text) {
                                    setFieldValue?.('tradetype', value);
                                    setValue('tradetype', value);
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
