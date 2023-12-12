import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, IconTradeTypes, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useDBotStore } from 'Stores/useDBotStore';
import { TFormData } from '../types';
import { Analytics } from '@deriv/analytics';
import { useStore } from '@deriv/stores';

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
    fullWidth?: boolean;
};

const TradeTypeSelect: React.FC<TTradeTypeSelect> = ({ fullWidth = false }) => {
    const [trade_types, setTradeTypes] = React.useState([]);
    const { setFieldValue, values, validateForm } = useFormikContext<TFormData>();
    const { quick_strategy } = useDBotStore();
    const { setValue } = quick_strategy;
    const selected = values?.tradetype;
    const sendTradeTypeToRudderStack = (item: string) => {
        Analytics.trackEvent('ce_bot_quick_strategy_form', {
            action: 'choose_trade_type',
            trade_type: item,
            form_source: 'ce_bot_quick_strategy_form',
        });
    };

    React.useEffect(() => {
        if (values?.symbol) {
            const { contracts_for } = ApiHelpers.instance;
            const getTradeTypes = async () => {
                const trade_types = await contracts_for.getTradeTypesForQuickStrategy(values?.symbol);
                setTradeTypes(trade_types);
                const has_selected = trade_types?.some((trade_type: TTradeType) => trade_type.value === selected);
                if (!has_selected && trade_types?.[0]?.value !== selected) {
                    await setFieldValue?.('tradetype', trade_types?.[0].value);
                    await validateForm();
                    setValue('tradetype', trade_types?.[0].value);
                }
            };
            debounce(async () => {
                getTradeTypes();
            }, 100)();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values?.symbol]);

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
                                if ((item as TTradeType)?.value) {
                                    sendTradeTypeToRudderStack(item.text);
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
