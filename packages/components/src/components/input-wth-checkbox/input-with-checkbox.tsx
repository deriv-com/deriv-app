import React from 'react';
import { getDecimalPlaces } from '@deriv/shared';
import InputField from '../input-field';
import Checkbox from '../checkbox';
import Popover from '../popover';
import { TToastConfig } from '../types';
import { useDevice } from '@deriv-com/ui';

type TPosition = 'left' | 'right' | 'top' | 'bottom';
type TInputWithCheckbox = {
    addToast: (toast_config: TToastConfig) => void;
    removeToast: (e: string) => void;
    checkbox_tooltip_label?: boolean;
    className?: string;
    classNameBubble?: string;
    classNameInlinePrefix?: string;
    classNameInput?: string;
    classNamePrefix?: string;
    currency: string;
    current_focus?: string | null;
    defaultChecked: boolean;
    error_messages?: string[];
    is_negative_disabled: boolean;
    is_single_currency: boolean;
    is_input_hidden?: boolean;
    label: string;
    max_value?: number;
    name: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: number | string | boolean } }
    ) => void;
    setCurrentFocus: (name: string | null) => void;
    tooltip_label?: React.ReactNode;
    tooltip_alignment?: TPosition;
    error_message_alignment: string;
    value: number | string;
    is_disabled?: boolean;
};
const InputWithCheckbox = ({
    addToast,
    checkbox_tooltip_label,
    classNameBubble,
    classNameInlinePrefix,
    classNameInput,
    className,
    currency,
    current_focus,
    defaultChecked,
    error_message_alignment,
    error_messages,
    is_disabled,
    is_single_currency,
    is_negative_disabled,
    is_input_hidden,
    label,
    max_value,
    name,
    onChange,
    removeToast,
    setCurrentFocus,
    tooltip_alignment,
    tooltip_label,
    value,
}: TInputWithCheckbox) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    const input_wrapper_ref = React.useRef<HTMLDivElement>(null);
    const [is_checked, setChecked] = React.useState(defaultChecked);
    const { isDesktop } = useDevice();
    const checkboxName = `has_${name}`;
    React.useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);
    // eslint-disable-next-line consistent-return
    React.useEffect(() => {
        if (!isDesktop) {
            const showErrorToast = () => {
                if (typeof addToast === 'function') {
                    addToast({
                        key: `${name}__error`,
                        content: String(error_messages),
                        type: 'error',
                    });
                }
            };
            const removeErrorToast = () => {
                if (typeof removeToast === 'function') {
                    removeToast(`${name}__error`);
                }
            };
            if (error_messages?.length !== undefined && error_messages?.length > 0) {
                showErrorToast();
                return () => {
                    removeErrorToast();
                };
            }
        }
    }, [error_messages, addToast, removeToast, name, isDesktop]);

    const focusInput = () => {
        setTimeout(() => {
            const el_input: HTMLElement | null = (
                input_wrapper_ref.current?.nextSibling as HTMLElement
            )?.querySelector?.('input.dc-input-wrapper__input');
            el_input?.focus?.();
        });
    };

    const changeValue = () => {
        const new_is_checked = !is_checked;
        // e.target.checked is not reliable, we have to toggle its previous value
        onChange?.({ target: { name: checkboxName, value: new_is_checked } });
        if (new_is_checked) focusInput();
    };

    const enableInputOnClick = () => {
        if (!is_checked) {
            setChecked(true);
            onChange?.({ target: { name: checkboxName, value: true } });
            focusInput();
        }
    };

    const input = (
        <InputField
            className={className}
            classNameInlinePrefix={classNameInlinePrefix}
            classNameInput={classNameInput}
            currency={currency}
            current_focus={current_focus || ''}
            error_messages={error_messages}
            error_message_alignment={error_message_alignment}
            is_error_tooltip_hidden={!isDesktop}
            is_disabled={!!is_disabled}
            fractional_digits={getDecimalPlaces(currency)}
            id={`dc_${name}_input`}
            inline_prefix={is_single_currency ? currency : undefined}
            is_autocomplete_disabled
            is_float={getDecimalPlaces(currency) > 0}
            is_hj_whitelisted
            is_incrementable
            is_negative_disabled={is_negative_disabled}
            max_length={10}
            max_value={max_value}
            name={name}
            onChange={onChange}
            onClickInputWrapper={is_disabled ? undefined : enableInputOnClick}
            type='number'
            ariaLabel=''
            inputmode='decimal'
            value={value}
            setCurrentFocus={setCurrentFocus}
        />
    );

    const checkbox = (
        <Checkbox
            className={`${name}-checkbox__input`}
            ref={checkboxRef}
            id={`dc_${name}-checkbox_input`}
            onChange={changeValue}
            name={checkboxName}
            label={label}
            classNameLabel={`${name}-checkbox__label`}
            defaultChecked={defaultChecked}
            disabled={is_disabled}
        />
    );

    return (
        <React.Fragment>
            <div ref={input_wrapper_ref} className='dc-input-wrapper--inline'>
                {checkbox_tooltip_label ? (
                    <Popover
                        alignment='left'
                        classNameBubble='trade-container__popover'
                        is_bubble_hover_enabled
                        margin={2}
                        message={checkbox_tooltip_label}
                        relative_render
                    >
                        {checkbox}
                    </Popover>
                ) : (
                    <React.Fragment>{checkbox}</React.Fragment>
                )}
                {tooltip_label && (
                    <Popover
                        alignment={tooltip_alignment || 'left'}
                        classNameBubble={classNameBubble}
                        icon='info'
                        id={`dc_${name}-checkbox__tooltip`}
                        is_bubble_hover_enabled
                        message={tooltip_label}
                        margin={!isDesktop || tooltip_alignment === 'right' ? 0 : 216}
                        zIndex='9999'
                        {...(isDesktop ? { relative_render: tooltip_alignment === 'left' } : {})}
                    />
                )}
            </div>
            {!is_input_hidden && input}
        </React.Fragment>
    );
};

export default InputWithCheckbox;
