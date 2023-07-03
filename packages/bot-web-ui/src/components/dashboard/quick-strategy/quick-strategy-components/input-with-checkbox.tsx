import React from 'react';
import { Checkbox } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TInputs } from './components.types';
import { Inputs } from '.';

const InputWithCheckbox = observer(
    ({
        idx,
        field_name,
        id,
        className,
        label,
        checkbox_label,
        checkbox_field_name,
        checkbox_input_value,
        input_value,
        placeholder,
        is_uniq_strategy_field,
        trailing_icon_message,
        zIndex,
        uniq_selected_input,
        errors,
        is_input_field,
        handleChange,
        onChangeInputValue,
        setCurrentFocus,
    }: TInputs) => {
        const { quick_strategy } = useDBotStore();
        const { onChangeCheckedValue, input_martingale_allow_streak_limit } = quick_strategy;
        return (
            <div style={{ display: 'flex' }}>
                <Checkbox
                    label={checkbox_label || ''}
                    name={checkbox_field_name}
                    defaultChecked={!!input_martingale_allow_streak_limit}
                    onChange={e => {
                        onChangeCheckedValue(checkbox_input_value, e as React.ChangeEvent<HTMLInputElement>);
                    }}
                />
                <Inputs
                    idx={idx}
                    handleChange={handleChange}
                    onChangeInputValue={onChangeInputValue}
                    setCurrentFocus={setCurrentFocus}
                    field_name={field_name}
                    id={id}
                    className={className}
                    label={label}
                    input_value={input_value}
                    placeholder={placeholder}
                    is_uniq_strategy_field={is_uniq_strategy_field}
                    trailing_icon_message={trailing_icon_message}
                    zIndex={zIndex}
                    uniq_selected_input={uniq_selected_input}
                    errors={errors}
                    is_input_field={is_input_field}
                    disabled={!input_martingale_allow_streak_limit}
                />
            </div>
        );
    }
);

export default InputWithCheckbox;
