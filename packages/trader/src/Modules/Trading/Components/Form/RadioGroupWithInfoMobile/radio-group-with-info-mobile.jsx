import React from 'react';
import { RadioGroup, Popover } from '@deriv/components';

const RadioGroupWithInfoMobile = ({
    items_list,
    contract_name,
    current_value_object,
    onChange,
    info,
    is_tooltip_disabled = false,
    popover_alignment = 'right',
    toggleModal,
}) => {
    const onValueChange = e => {
        onChange({
            target: {
                name: current_value_object.name,
                value: Number(e.target.value),
            },
        });
        toggleModal();
    };

    return (
        <>
            <div className={`trade-params__${contract_name}-ic-info-wrapper`}>
                <Popover
                    alignment={popover_alignment}
                    disable_target_icon={is_tooltip_disabled}
                    icon='info'
                    id={`dt_${contract_name}-stake__tooltip`}
                    is_bubble_hover_enabled
                    zIndex={9999}
                    message={info}
                />
            </div>
            <RadioGroup
                className={`trade-params__${contract_name}-radio-group`}
                name={`trade-params__${contract_name}-radio`}
                selected={!Number.isNaN(current_value_object.value) ? current_value_object.value?.toString() : ''}
                onToggle={onValueChange}
            >
                {items_list.map(({ text, value }) => (
                    <RadioGroup.Item key={value} id={text} label={text} value={value?.toString()} />
                ))}
            </RadioGroup>
        </>
    );
};

export default RadioGroupWithInfoMobile;
