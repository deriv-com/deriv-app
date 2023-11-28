import React, { ChangeEvent } from 'react';
import { RadioGroup, Popover } from '@deriv/components';

type TItemsList = {
    text: string;
    value: number;
};

type TRadioGroupWithInfoMobile = {
    items_list?: TItemsList[];
    contract_name: string;
    current_value_object: {
        name: string;
        value: number;
    };
    onChange: (event: {
        target: {
            name: string;
            value: number;
        };
    }) => void;
    info?: React.ComponentProps<typeof Popover>['message'];
    is_tooltip_disabled?: boolean;
    popover_alignment?: React.ComponentProps<typeof Popover>['alignment'];
    toggleModal: () => void;
    should_show_tooltip?: boolean;
};

const RadioGroupWithInfoMobile = ({
    items_list,
    contract_name,
    current_value_object,
    onChange,
    info,
    is_tooltip_disabled = false,
    popover_alignment = 'right',
    toggleModal,
    should_show_tooltip = true,
}: TRadioGroupWithInfoMobile) => {
    const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            {should_show_tooltip && (
                <div className={`trade-params__${contract_name}-ic-info-wrapper`}>
                    <Popover
                        alignment={popover_alignment}
                        classNameBubble='dc-popover__trade-params'
                        disable_target_icon={is_tooltip_disabled}
                        icon='info'
                        id={`dt_${contract_name}-stake__tooltip`}
                        is_bubble_hover_enabled
                        zIndex='9999'
                        message={info}
                    />
                </div>
            )}
            <RadioGroup
                className={`trade-params__${contract_name}-radio-group`}
                name={`trade-params__${contract_name}-radio`}
                selected={!Number.isNaN(current_value_object.value) ? current_value_object.value?.toString() : ''}
                onToggle={onValueChange}
            >
                {items_list?.map(({ text, value }) => (
                    <RadioGroup.Item key={value} id={text} label={text} value={value?.toString()} disabled={false} />
                ))}
            </RadioGroup>
        </>
    );
};

export default RadioGroupWithInfoMobile;
