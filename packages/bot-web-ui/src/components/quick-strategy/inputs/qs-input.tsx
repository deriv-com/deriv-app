import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Input, Popover } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Analytics } from '@deriv/analytics';
import debounce from 'lodash.debounce';

type TQSInput = {
    name: string;
    onChange: (key: string, value: string | number | boolean) => void;
    type?: string;
    fullwidth?: boolean;
    attached?: boolean;
    should_have?: { key: string; value: string | number | boolean }[];
    disabled?: boolean;
};

const DEBOUNCE_INTERVAL_TIME = 300;
const QSInput: React.FC<TQSInput> = observer(
    ({ name, onChange, type = 'text', fullwidth = false, attached = false, disabled = false }) => {
        const {
            ui: { is_mobile },
        } = useStore();
        const [has_focus, setFocus] = React.useState(false);
        const { setFieldValue, setFieldTouched } = useFormikContext();
        const is_number = type === 'number';

        const sendPlusValueToRudderstack = (key: string, value: string) => {
            Analytics.trackEvent('ce_bot_quick_strategy_form', {
                action: 'change_parameter_value',
                parameter_value: key,
                plus_push_amount: value,
            });
        };

        const sendMinusValueToRudderstack = (key: string, value: string) => {
            Analytics.trackEvent('ce_bot_quick_strategy_form', {
                action: 'change_parameter_value',
                parameter_value: key,
                minus_push_amount: value,
            });
        };

        const throttleChangePlus = React.useCallback(
            debounce(sendMinusValueToRudderstack, DEBOUNCE_INTERVAL_TIME, {
                trailing: true,
                leading: false,
            }),
            []
        );

        const throttleChangeMinus = React.useCallback(
            debounce(sendPlusValueToRudderstack, DEBOUNCE_INTERVAL_TIME, {
                trailing: true,
                leading: false,
            }),
            []
        );

        const handleChange = (e: MouseEvent<HTMLButtonElement>, value: string) => {
            e?.preventDefault();
            onChange(name, value);
            setFieldTouched(name, true, true);
            setFieldValue(name, value);
        };

        return (
            <Field name={name} key={name} id={name}>
                {({ field, meta }: FieldProps) => {
                    const { error } = meta;
                    const has_error = error;
                    return (
                        <div
                            className={classNames('qs__form__field', {
                                'full-width': fullwidth,
                                'no-top-spacing': attached,
                                'no-border-top': attached,
                            })}
                        >
                            <div
                                data-testid='qs-input-container'
                                onMouseEnter={() => setFocus(true)}
                                onMouseLeave={() => setFocus(false)}
                            >
                                <Popover
                                    alignment='bottom'
                                    message={error}
                                    is_open={is_mobile ? !!error : !!error && has_focus}
                                    zIndex='9999'
                                    classNameBubble='qs__warning-bubble'
                                    has_error
                                    should_disable_pointer_events
                                >
                                    <Input
                                        data_testId='qs-input'
                                        className={classNames('qs__input', { error: has_error })}
                                        type={type}
                                        leading_icon={
                                            is_number ? (
                                                <button
                                                    data-testid='qs-input-decrease'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        const value = Number(field.value) - 1;
                                                        handleChange(e, String(value % 1 ? value.toFixed(2) : value));
                                                        throttleChangeMinus(
                                                            e,
                                                            String(value % 1 ? value.toFixed(2) : value)
                                                        );
                                                    }}
                                                >
                                                    -
                                                </button>
                                            ) : undefined
                                        }
                                        trailing_icon={
                                            is_number ? (
                                                <button
                                                    data-testid='qs-input-increase'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        const value = Number(field.value) + 1;
                                                        handleChange(e, String(value % 1 ? value.toFixed(2) : value));
                                                        throttleChangePlus(
                                                            e,
                                                            String(value % 1 ? value.toFixed(2) : value)
                                                        );
                                                    }}
                                                >
                                                    +
                                                </button>
                                            ) : null
                                        }
                                        {...field}
                                        disabled={disabled}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const value = is_number ? Number(e.target.value) : e.target.value;
                                            onChange(name, value);
                                        }}
                                    />
                                </Popover>
                            </div>
                        </div>
                    );
                }}
            </Field>
        );
    }
);

export default QSInput;
