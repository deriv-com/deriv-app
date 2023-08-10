import React from 'react';
import classNames from 'classnames';
import { isMobile } from '@deriv/shared';
import { TInputsFieldNames } from '../quick-strategy.types';
import { TInputs } from './components.types';
import { InputField } from '.';

const Inputs = ({
    idx,
    field_name,
    id,
    className,
    label,
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
    const is_mobile = isMobile();
    return is_input_field ? (
        <div
            className={classNames('quick-strategy__form-row', {
                'quick-strategy__form-row--multiple': !is_mobile,
            })}
        >
            <InputField
                idx={idx}
                handleChange={handleChange}
                onChangeInputValue={onChangeInputValue}
                setCurrentFocus={setCurrentFocus}
                is_mobile={is_mobile}
                field_name={field_name as TInputsFieldNames}
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
            />
        </div>
    ) : (
        <></>
    );
};

Inputs.displayName = 'Inputs';

export default React.memo(Inputs);
