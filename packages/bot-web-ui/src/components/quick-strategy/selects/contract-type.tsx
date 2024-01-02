import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Analytics } from '@deriv/analytics';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TFormData } from '../types';

type TContractTypesItem = {
    text: string;
    value: string;
};

type TContractTypes = {
    name: string;
    attached?: boolean;
};

const ContractTypes: React.FC<TContractTypes> = observer(({ name }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [list, setList] = React.useState<TContractTypesItem[]>([]);
    const { quick_strategy } = useDBotStore();
    const { setValue } = quick_strategy;
    const { setFieldValue, validateForm, values } = useFormikContext<TFormData>();
    const { symbol, tradetype } = values;
    const selected = values?.type;

    const sendTradeTypeToRudderStack = (item: string) => {
        Analytics.trackEvent('ce_bot_quick_strategy_form', {
            action: 'choose_trade_type',
            trade_type: item,
            form_source: 'ce_bot_quick_strategy_form',
        });
    };

    const sendTradeTypeValueToRudderStack = (item: string) => {
        Analytics.trackEvent('ce_bot_quick_strategy_form', {
            action: 'choose_trade_type_mode',
            trade_type_mode: item,
            form_source: 'ce_bot_quick_strategy_form',
        });
    };

    React.useEffect(() => {
        if (tradetype && symbol && selected !== '') {
            const getContractTypes = async () => {
                const { contracts_for } = ApiHelpers.instance;
                const categories = await contracts_for.getContractTypes(tradetype);
                setList(categories);
                const has_selected = categories?.some((contract: TContractTypesItem) => contract.value === selected);
                if (!has_selected) {
                    setFieldValue?.(name, categories?.[0]?.value);
                    setValue(name, categories?.[0]?.value);
                    validateForm();
                }
            };
            getContractTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, tradetype, selected]);

    const handleChange = (value: string) => {
        setFieldValue?.(name, value);
        setValue(name, value);
    };

    const key = `qs-contract-type-${name}`;

    return (
        <div className='qs__form__field qs__form__field__input no-top-spacing'>
            <Field name={name} key={key} id={key}>
                {({ field }: FieldProps) => {
                    const selected_item = list?.find((item: TContractTypesItem) => item.value === field.value);
                    if (is_mobile) {
                        return (
                            <ul className='qs__form__field__list' data-testid='dt-qs-contract-types'>
                                {list.map((item: TContractTypesItem) => {
                                    const is_active = selected_item?.value === item.value;
                                    return (
                                        <li
                                            key={item.value}
                                            className={classNames('qs__form__field__list__item', {
                                                'qs__form__field__list__item--active': is_active,
                                            })}
                                            onClick={() => {
                                                sendTradeTypeValueToRudderStack(item.text);
                                                handleChange(item.value);
                                            }}
                                        >
                                            <Text size='xs' color='prominent' weight={is_active ? 'bold ' : 'normal'}>
                                                {item.text}
                                            </Text>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    }
                    return (
                        <Autocomplete
                            {...field}
                            readOnly
                            inputMode='none'
                            data-testid='qs_autocomplete_contract_type'
                            autoComplete='off'
                            className='qs__select contract-type'
                            value={selected_item?.text || ''}
                            list_items={list}
                            onItemSelection={(item: TItem) => {
                                if ((item as TContractTypesItem)?.value) {
                                    handleChange((item as TContractTypesItem)?.value as string);
                                    sendTradeTypeToRudderStack(item?.text);
                                }
                            }}
                        />
                    );
                }}
            </Field>
        </div>
    );
});

export default ContractTypes;
