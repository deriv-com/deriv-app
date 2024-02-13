import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import { Input, Popover } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { DEBOUNCE_INTERVAL_TIME } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendQsParameterChangeEvent } from '../analytics/rudderstack-quick-strategy';

type TQSInput = {
    name: string;
    onChange: (key: string, value: string | number | boolean) => void;
    type?: string;
    attached?: boolean;
    should_have?: { key: string; value: string | number | boolean }[];
    disabled?: boolean;
    min?: number;
    max?: number;
};

const QSInput: React.FC<TQSInput> = observer(
    ({ name, onChange, type = 'text', attached = false, disabled = false, min, max }: TQSInput) => {
        const {
            ui: { is_mobile },
        } = useStore();
        const { quick_strategy } = useDBotStore();
        const { loss_threshold_warning_data } = quick_strategy;

        const [has_focus, setFocus] = React.useState(false);
        const { setFieldValue, setFieldTouched } = useFormikContext();
        const is_number = type === 'number';

        // eslint-disable-next-line react-hooks/exhaustive-deps
        const debounceInputChange = React.useCallback(
            // Need the useCallback to stop the debounce function from being recreated on every render
            debounce(rudderStackSendQsParameterChangeEvent, DEBOUNCE_INTERVAL_TIME, {
                trailing: true,
                leading: false,
            }),
            []
        );

        const handleButtonInputChange = (e: MouseEvent<HTMLButtonElement>, value: string) => {
            e?.preventDefault();
            onChange(name, value);
            setFieldTouched(name, true, true);
            setFieldValue(name, value);
            debounceInputChange({
                parameter_type: name,
                parameter_value: value,
                parameter_field_type: 'number',
                manual_parameter_input: 'no',
                plus_minus_push: 'yes',
            });
        };

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input_value = e.target.value;
            const value = is_number ? Number(input_value) : input_value;
            onChange(name, value);
            debounceInputChange({
                parameter_type: name,
                parameter_value: value,
                parameter_field_type: 'number',
                manual_parameter_input: 'yes',
                plus_minus_push: 'no',
            });
        };

        return (
            <Field name={name} key={name} id={name}>
                {({ field, meta }: FieldProps) => {
                    const { error } = meta;
                    const has_error = error;
                    return (
                        <div
                            className={classNames('qs__form__field qs__form__field__input', {
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
                                        className={classNames(
                                            'qs__input',
                                            { error: has_error },
                                            { highlight: loss_threshold_warning_data?.highlight_field?.includes(name) }
                                        )}
                                        type={type}
                                        leading_icon={
                                            is_number ? (
                                                <button
                                                    disabled={disabled || (!!min && field.value <= min)}
                                                    data-testid='qs-input-decrease'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        const value = Number(field.value) - 1;
                                                        handleButtonInputChange(
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
                                                    disabled={disabled || (!!max && field.value >= max)}
                                                    data-testid='qs-input-increase'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        const value = Number(field.value) + 1;
                                                        handleButtonInputChange(
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChange(e)}
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
