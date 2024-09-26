import React from 'react';
import { useFormikContext } from 'formik';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import QSInput from './inputs/add-input';
import QSInputLabel from './inputs/add-input-label';
import QsTextInput from './inputs/add-text-input';
import QSCheckbox from './inputs/add-toggle-switch';
import ContractTypeSelect from './selects/contract-type';
import DurationTypeSelect from './selects/duration-type';
import SymbolSelect from './selects/symbol';
import TradeTypeSelect from './selects/trade-type';
import { STRATEGIES } from './config';
import { SERVER_BOT_FIELDS } from './constants';
import { TConfigItem, TFormData, TShouldHave } from './types';
import './add-bot.scss';

const QuickStrategyForm = observer(() => {
    const { ui } = useStore();
    const { server_bot } = useDBotStore();
    const { selected_strategy, setValue, form_data, current_duration_min_max } = server_bot;
    const config: TConfigItem[][] = STRATEGIES[selected_strategy]?.fields;
    const { is_desktop } = ui;
    const { values, setFieldTouched, setFieldValue } = useFormikContext<TFormData>();

    const [isEnabledToggleSwitch, setIsEnabledToggleSwitch] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener('keydown', handleEnter);
        let data: TFormData | null = null;
        try {
            data = JSON.parse(localStorage.getItem(SERVER_BOT_FIELDS) ?? '{}');
        } catch {
            data = null;
        }
        setIsEnabledToggleSwitch(!!data?.boolean_max_stake);

        return () => {
            window.removeEventListener('keydown', handleEnter);
        };
    }, []);

    const onChange = async (key: string, value: string | number | boolean) => {
        setValue(key, value);
        await setFieldTouched(key, true, true);
        await setFieldValue(key, value, true);
    };

    const handleEnter = (event: KeyboardEvent) => {
        if (event?.key && event.key == 'Enter') {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const shouldEnable = (should_have: TShouldHave[]) =>
        should_have.every(item => {
            const item_value = values?.[item.key]?.toString();
            if (item.multiple) return item.multiple.includes(item_value);
            return values[item.key as keyof TFormData] === item.value;
        });

    const toggleSwitch = () => {
        setIsEnabledToggleSwitch(prev => !prev);
    };

    const renderForm = () => {
        return config.map((group, group_index) => {
            if (!group?.length) return null;
            return (
                <div className='ssb-add__body__content__form__group' key={group_index}>
                    {group.map((field, field_index) => {
                        const key = `${field.name || field.type} + ${field_index}`;

                        if (
                            (!is_desktop && field.hide?.includes('mobile')) ||
                            (is_desktop && field.hide?.includes('desktop'))
                        ) {
                            return null;
                        }

                        switch (field.type) {
                            // Generic or common fields
                            case 'text': {
                                if (field.name === 'name') {
                                    return <QsTextInput key={key} field={field} name={field.name} />;
                                }
                                return (
                                    <QSInput
                                        {...field}
                                        key={key}
                                        onChange={onChange}
                                        name={field.name as string}
                                        has_currency_unit={false}
                                    />
                                );
                            }
                            case 'number': {
                                if (!field.name) return null;
                                const {
                                    should_have = [],
                                    hide_without_should_have = false,
                                    has_currency_unit = false,
                                } = field;
                                const should_enable = shouldEnable(should_have);
                                const initial_stake = 1;
                                let min = 1;
                                let max;
                                if (field.name === 'duration' && current_duration_min_max) {
                                    min = current_duration_min_max.min;
                                    max = current_duration_min_max.max;
                                }
                                const should_validate = field.should_have;
                                if (should_validate && field.name === 'max_stake') {
                                    min = +form_data?.stake;
                                    if (isNaN(min)) {
                                        min = +initial_stake;
                                    }
                                }
                                if (should_validate && field.name === 'last_digit_prediction') {
                                    if (
                                        isNaN(+form_data?.last_digit_prediction) ||
                                        +form_data?.last_digit_prediction === 1
                                    ) {
                                        min = 0;
                                    }
                                    if (+form_data?.last_digit_prediction > 0) {
                                        min = +form_data?.last_digit_prediction - 1;
                                    }
                                    max = 9;
                                }
                                if (should_have?.length) {
                                    if (!should_enable && (!is_desktop || hide_without_should_have)) {
                                        return null;
                                    }
                                    return (
                                        <QSInput
                                            {...field}
                                            key={key}
                                            name={field.name as string}
                                            disabled={!should_enable}
                                            onChange={onChange}
                                            min={min}
                                            max={max}
                                            has_currency_unit={has_currency_unit}
                                        />
                                    );
                                }
                                return (
                                    <QSInput
                                        {...field}
                                        onChange={onChange}
                                        key={key}
                                        name={field.name as string}
                                        min={min}
                                        max={max}
                                        has_currency_unit={has_currency_unit}
                                    />
                                );
                            }
                            case 'label': {
                                if (!field.label) return null;
                                const { should_have = [], hide_without_should_have = false } = field;
                                const should_enable = shouldEnable(should_have);
                                if (!should_enable && hide_without_should_have) {
                                    return null;
                                }
                                return (
                                    <QSInputLabel key={key} label={field.label} description={field.description || ''} />
                                );
                            }
                            case 'checkbox':
                                return (
                                    <QSCheckbox
                                        {...field}
                                        key={key}
                                        name={field.name as string}
                                        label={field.label as string}
                                        isEnabledToggleSwitch={!!isEnabledToggleSwitch}
                                        setIsEnabledToggleSwitch={toggleSwitch}
                                    />
                                );
                            // Dedicated components only for Quick-Strategy
                            case 'symbol':
                                return <SymbolSelect {...field} key={key} />;
                            case 'tradetype':
                                return <TradeTypeSelect {...field} key={key} />;
                            case 'durationtype':
                                return <DurationTypeSelect {...field} key={key} />;
                            case 'contract_type':
                                return <ContractTypeSelect {...field} key={key} name={field.name as string} />;
                            default:
                                return null;
                        }
                    })}
                </div>
            );
        });
    };

    return <div>{renderForm()}</div>;
});

export default QuickStrategyForm;
