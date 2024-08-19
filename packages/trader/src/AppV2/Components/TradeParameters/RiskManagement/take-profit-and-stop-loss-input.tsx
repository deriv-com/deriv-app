import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { focusAndOpenKeyboard } from 'AppV2/Utils/trade-params-utils';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';

type TTakeProfitAndStopLossInputProps = {
    classname?: string;
    has_save_button?: boolean;
    has_initial_value_parent_ref?: React.MutableRefObject<boolean | undefined>;
    is_save_btn_clicked?: boolean;
    initial_value_parent_ref?: React.MutableRefObject<string | number | undefined>;
    onActionSheetClose: () => void;
    type?: 'take_profit' | 'stop_loss';
    should_wrap_with_actionsheet?: boolean;
    show_acceptable_range?: boolean;
};

const TakeProfitAndStopLossInput = ({
    classname,
    has_save_button = true,
    has_initial_value_parent_ref,
    is_save_btn_clicked: is_save_btn_clicked_initial_value,
    initial_value_parent_ref,
    onActionSheetClose,
    type = 'take_profit',
    should_wrap_with_actionsheet = true,
    show_acceptable_range = true,
}: TTakeProfitAndStopLossInputProps) => {
    const {
        contract_type,
        currency,
        has_take_profit,
        has_stop_loss,
        is_accumulator,
        take_profit,
        stop_loss,
        trade_types,
        trade_type_tab,
        onChangeMultiple,
        onChange,
        setWheelPickerInitialValues,
        validation_params,
        validation_errors,
    } = useTraderStore();

    const is_take_profit_input = type === 'take_profit';
    // Some of the validation errors should be shown only after Save button was clicked
    const [is_save_btn_clicked, setIsSaveBtnClicked] = React.useState(is_save_btn_clicked_initial_value || false);
    // Duplicate information about error in ref, because on unMount state variables and be_error_text are undefined
    const has_error_ref = React.useRef<boolean>();

    /* All initial values are used to restore correct values if user closed ActionSheet without Saving or refreshed the page.
    Current component can used its own ref values or ref, passed from parent.
    Last option is needed in case if the parent needs an access to initial values.
    */
    const has_initial_value = React.useRef<boolean>();
    const has_initial_value_ref = has_initial_value_parent_ref || has_initial_value;
    const has_selected_value_ref = React.useRef(is_take_profit_input ? has_take_profit : has_stop_loss);

    const initial_value = React.useRef<string | number | undefined>('');
    const initial_value_ref = initial_value_parent_ref || initial_value;
    const selected_value_ref = React.useRef<string | number | undefined>(
        is_take_profit_input ? take_profit : stop_loss
    );

    // Refs for handling focusing and bluring
    const input_ref = React.useRef<HTMLInputElement>(null);
    const focused_input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const decimals = getDecimalPlaces(currency);
    const be_error_text = is_take_profit_input ? validation_errors.take_profit[0] : validation_errors.stop_loss[0];
    const currency_display_code = getCurrencyDisplayCode(currency);
    // We can't use has_take_profit here as we are checking if take_profit is empty string or undefined, which is not connected with has_take_profit
    const should_show_be_error = is_take_profit_input
        ? (be_error_text && !!take_profit) || (be_error_text && !take_profit && is_save_btn_clicked)
        : (be_error_text && !!stop_loss) || (be_error_text && !stop_loss && is_save_btn_clicked);
    const min_value = is_take_profit_input
        ? validation_params[contract_types[0]]?.take_profit?.min
        : validation_params[contract_types[0]]?.stop_loss?.min;
    const max_value = is_take_profit_input
        ? validation_params[contract_types[0]]?.take_profit?.max
        : validation_params[contract_types[0]]?.stop_loss?.max;
    const Component = should_wrap_with_actionsheet ? ActionSheet.Content : 'div';

    // Storing data from validation params (proposal) in state in case if we got a validation error from BE and proposal stop streaming
    const [info, setInfo] = React.useState({
        min_value,
        max_value,
    });

    const input_message =
        info.min_value && info.max_value && has_selected_value_ref.current && show_acceptable_range ? (
            <Localize
                i18n_default_text='Acceptable range: {{min_value}} to {{max_value}} {{currency}}'
                values={{
                    currency: currency_display_code,
                    min_value: info.min_value,
                    max_value: info.max_value,
                }}
            />
        ) : (
            ''
        );

    const onToggleSwitch = (new_value: boolean) => {
        has_selected_value_ref.current = new_value;

        if (new_value) {
            clearTimeout(focus_timeout.current);
            focus_timeout.current = focusAndOpenKeyboard(focused_input_ref.current, input_ref.current);
        } else {
            input_ref.current?.blur();
        }

        onChangeMultiple({
            ...(is_take_profit_input ? { has_take_profit: new_value } : { has_stop_loss: new_value }),
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSaveBtnClicked(false);

        let value = String(e.target.value).replace(',', '.');
        if (value.startsWith('.')) {
            value = value.replace(/^\./, '0.');
        }
        if (value.length > 1) {
            value = /^[0-]+$/.test(value) ? '0' : value.replace(/^0*/, '').replace(/^\./, '0.');
        }

        selected_value_ref.current = value;
        onChange({ target: { name: is_take_profit_input ? 'take_profit' : 'stop_loss', value } });
    };

    const onSave = () => {
        setIsSaveBtnClicked(true);

        if (be_error_text && has_selected_value_ref.current) {
            return;
        }
        // Initial values are set on Mount and been updated on Save
        if (has_selected_value_ref.current !== has_initial_value_ref.current) {
            has_initial_value_ref.current = has_selected_value_ref.current;
        }
        if (selected_value_ref.current !== initial_value_ref.current) {
            initial_value_ref.current = selected_value_ref.current;
        }

        const is_enabled = be_error_text ? false : has_selected_value_ref.current;
        // We should switch off DC if TP or SL is on and vice versa
        onChangeMultiple({
            ...(is_take_profit_input ? { has_take_profit: is_enabled } : { has_stop_loss: is_enabled }),
            ...(is_enabled ? { has_cancellation: false } : {}),
        });

        onChange({
            target: {
                name: is_take_profit_input ? 'take_profit' : 'stop_loss',
                value: be_error_text || selected_value_ref.current === '0' ? '' : selected_value_ref.current,
            },
        });

        onActionSheetClose();
    };

    React.useEffect(() => {
        has_error_ref.current = !!be_error_text;
    }, [be_error_text]);

    React.useEffect(() => {
        setIsSaveBtnClicked(!!is_save_btn_clicked_initial_value);
    }, [is_save_btn_clicked_initial_value]);

    React.useEffect(() => {
        setInfo(info => {
            if ((info.min_value !== min_value && min_value) || (info.max_value !== max_value && max_value)) {
                return {
                    min_value,
                    max_value,
                };
            }
            return info;
        });
    }, [min_value, max_value]);

    React.useEffect(() => {
        if (is_take_profit_input) {
            if (!has_initial_value_ref.current && has_take_profit) {
                has_initial_value_ref.current = has_take_profit;
                setWheelPickerInitialValues({ name: 'has_take_profit', value: has_take_profit });
            }
            if (!initial_value_ref.current && take_profit) {
                initial_value_ref.current = take_profit;
                setWheelPickerInitialValues({ name: 'take_profit', value: take_profit });
            }
        } else {
            if (!has_initial_value_ref.current && has_stop_loss) {
                has_initial_value_ref.current = has_stop_loss;
                setWheelPickerInitialValues({ name: 'has_stop_loss', value: has_stop_loss });
            }
            if (!initial_value_ref.current && stop_loss) {
                initial_value_ref.current = stop_loss;
                setWheelPickerInitialValues({ name: 'stop_loss', value: stop_loss });
            }
        }

        return () => {
            const should_set_empty_string =
                initial_value_ref.current === '' ||
                initial_value_ref.current === '0' ||
                (has_error_ref.current && selected_value_ref.current !== '0' && selected_value_ref.current !== '');

            const is_enabled = should_set_empty_string ? false : has_initial_value_ref.current;
            onChangeMultiple({
                ...(is_take_profit_input ? { has_take_profit: is_enabled } : { has_stop_loss: is_enabled }),
            });
            onChange({
                target: {
                    name: is_take_profit_input ? 'take_profit' : 'stop_loss',
                    value: should_set_empty_string ? '' : initial_value_ref.current,
                },
            });

            clearTimeout(focus_timeout.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <Component className={clsx('take-profit__wrapper', classname)} key={type}>
                <div className='take-profit__content'>
                    <Text>
                        {is_take_profit_input ? (
                            <Localize i18n_default_text='Take profit' />
                        ) : (
                            <Localize i18n_default_text='Stop loss' />
                        )}
                    </Text>
                    <ToggleSwitch checked={has_selected_value_ref.current} onChange={onToggleSwitch} />
                </div>
                <TextFieldWithSteppers
                    allowDecimals
                    disabled={!has_selected_value_ref.current}
                    decimals={decimals}
                    data-testid='dt_input_with_steppers'
                    inputMode='decimal'
                    message={should_show_be_error ? be_error_text : input_message}
                    minusDisabled={Number(selected_value_ref.current) - 1 <= 0}
                    name={type}
                    onChange={onInputChange}
                    placeholder={localize('Amount')}
                    ref={input_ref}
                    regex={/[^0-9.,]/g}
                    status={should_show_be_error ? 'error' : 'neutral'}
                    textAlignment='center'
                    unitLeft={currency_display_code}
                    variant='fill'
                    value={selected_value_ref.current}
                />
                {!has_selected_value_ref.current && (
                    <button
                        className='take-profit__overlay'
                        onClick={() => onToggleSwitch(true)}
                        data-testid='dt_take_profit_overlay'
                    />
                )}
                {/* this input with inline styles is needed to fix a focus issue in Safari */}
                <input ref={focused_input_ref} style={{ height: 0, opacity: 0, display: 'none' }} inputMode='decimal' />
                {is_accumulator && (
                    <CaptionText color='quill-typography__color--subtle' className='take-profit__accu-information'>
                        <Localize i18n_default_text='Note: Cannot be adjusted for ongoing accumulator contracts.' />
                    </CaptionText>
                )}
            </Component>
            {has_save_button && (
                <ActionSheet.Footer
                    alignment='vertical'
                    primaryAction={{
                        content: <Localize i18n_default_text='Save' />,
                        onAction: onSave,
                    }}
                    shouldCloseOnPrimaryButtonClick={false}
                />
            )}
        </React.Fragment>
    );
};

export default observer(TakeProfitAndStopLossInput);
