import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { focusAndOpenKeyboard } from 'AppV2/Utils/trade-params-utils';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';

type TTakeProfitInputProps = {
    classname?: string;
    has_save_button?: boolean;
    onActionSheetClose: () => void;
    has_tp_initial_value_ref_parent?: React.MutableRefObject<boolean | undefined>;
    tp_initial_value_ref_parent?: React.MutableRefObject<string | number | undefined>;
    is_parent_save_btn_clicked?: boolean;
};

const TakeProfitInput = ({
    classname,
    has_save_button = true,
    onActionSheetClose,
    has_tp_initial_value_ref_parent,
    tp_initial_value_ref_parent,
    is_parent_save_btn_clicked,
}: TTakeProfitInputProps) => {
    const {
        contract_type,
        currency,
        has_take_profit,
        is_accumulator,
        take_profit,
        trade_types,
        trade_type_tab,
        onChangeMultiple,
        onChange,
        setWheelPickerInitialValues,
        validation_params,
        validation_errors,
    } = useTraderStore();

    const [is_save_btn_clicked, setIsSaveBtnClicked] = React.useState(is_parent_save_btn_clicked || false);
    const has_error_ref = React.useRef<boolean>();

    const has_tp_initial_value_component = React.useRef<boolean>();
    const has_tp_initial_value_ref = has_tp_initial_value_ref_parent || has_tp_initial_value_component;
    const has_tp_selected_value_ref = React.useRef(has_take_profit);

    const tp_initial_value_component = React.useRef<string | number | undefined>('');
    const tp_initial_value_ref = tp_initial_value_ref_parent || tp_initial_value_component;
    const tp_selected_value_ref = React.useRef<string | number | undefined>(take_profit);

    const input_ref = React.useRef<HTMLInputElement>(null);
    const focused_input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const decimals = getDecimalPlaces(currency);
    const be_error_text = validation_errors.take_profit[0];
    const currency_display_code = getCurrencyDisplayCode(currency);
    const should_show_be_error =
        (be_error_text && !!take_profit) || (be_error_text && !take_profit && is_save_btn_clicked);
    const min_take_profit = validation_params[contract_types[0]]?.take_profit?.min;
    const max_take_profit = validation_params[contract_types[0]]?.take_profit?.max;

    const [info, setInfo] = React.useState({
        min_take_profit,
        max_take_profit,
    });

    const onToggleSwitch = (new_value: boolean) => {
        has_tp_selected_value_ref.current = new_value;

        if (new_value) {
            clearTimeout(focus_timeout.current);
            focus_timeout.current = focusAndOpenKeyboard(focused_input_ref.current, input_ref.current);
        } else {
            input_ref.current?.blur();
        }

        onChangeMultiple({
            has_take_profit: new_value,
            ...(new_value ? { has_cancellation: false } : {}),
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSaveBtnClicked(false);

        let value = String(e.target.value).replace(',', '.');
        if (value.startsWith('.')) {
            value = value.replace(/^\./, '0.');
        }
        if (value.length > 1) {
            if (/^[0-]+$/.test(value)) {
                value = '0';
            } else {
                value = value.replace(/^0*/, '').replace(/^\./, '0.');
            }
        }

        tp_selected_value_ref.current = value;

        onChange({ target: { name: 'take_profit', value } });
    };

    const onSave = () => {
        setIsSaveBtnClicked(true);

        if (be_error_text && has_tp_selected_value_ref.current) {
            return;
        }

        if (has_tp_selected_value_ref.current !== has_tp_initial_value_ref.current) {
            has_tp_initial_value_ref.current = has_tp_selected_value_ref.current;
        }
        if (tp_selected_value_ref.current !== tp_initial_value_ref.current) {
            tp_initial_value_ref.current = tp_selected_value_ref.current;
        }

        const has_take_profit = has_error_ref.current ? false : has_tp_selected_value_ref.current;
        onChangeMultiple({
            has_take_profit,
            ...(has_take_profit ? { has_cancellation: false } : {}),
        });

        onChange({
            target: {
                name: 'take_profit',
                value:
                    has_error_ref.current || tp_selected_value_ref.current === '0' ? '' : tp_selected_value_ref.current,
            },
        });

        onActionSheetClose();
    };

    const input_message =
        info.min_take_profit && info.max_take_profit ? (
            <Localize
                i18n_default_text='Acceptable range: {{min_take_profit}} to {{max_take_profit}} {{currency}}'
                values={{
                    currency: currency_display_code,
                    min_take_profit: info.min_take_profit,
                    max_take_profit: info.max_take_profit,
                }}
            />
        ) : (
            ''
        );

    React.useEffect(() => {
        has_error_ref.current = !!be_error_text;
    }, [be_error_text]);

    React.useEffect(() => {
        setIsSaveBtnClicked(!!is_parent_save_btn_clicked);
    }, [is_parent_save_btn_clicked]);

    React.useEffect(() => {
        setInfo(info => {
            if (
                (info.min_take_profit !== min_take_profit && min_take_profit) ||
                (info.max_take_profit !== max_take_profit && max_take_profit)
            ) {
                return {
                    min_take_profit,
                    max_take_profit,
                };
            }
            return info;
        });
    }, [min_take_profit, max_take_profit]);

    React.useEffect(() => {
        if (!has_tp_initial_value_ref.current && has_take_profit) {
            has_tp_initial_value_ref.current = has_take_profit;
            setWheelPickerInitialValues({ name: 'has_take_profit', value: has_take_profit });
        }
        if (!tp_initial_value_ref.current && take_profit) {
            tp_initial_value_ref.current = take_profit;
            setWheelPickerInitialValues({ name: 'take_profit', value: take_profit });
        }

        return () => {
            const should_set_empty_string =
                tp_initial_value_ref.current === '' ||
                tp_initial_value_ref.current === '0' ||
                (has_error_ref.current &&
                    tp_selected_value_ref.current !== '0' &&
                    tp_selected_value_ref.current !== '');

            const has_take_profit = should_set_empty_string ? false : has_tp_initial_value_ref.current;
            onChangeMultiple({
                has_take_profit,
                ...(has_take_profit ? { has_cancellation: false } : {}),
            });
            onChange({
                target: {
                    name: 'take_profit',
                    value: should_set_empty_string ? '' : tp_initial_value_ref.current,
                },
            });

            clearTimeout(focus_timeout.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <ActionSheet.Content className={clsx('take-profit__wrapper', classname)}>
                <div className='take-profit__content'>
                    <Text>
                        <Localize i18n_default_text='Take profit' />
                    </Text>
                    <ToggleSwitch checked={has_tp_selected_value_ref.current} onChange={onToggleSwitch} />
                </div>
                <TextFieldWithSteppers
                    allowDecimals
                    disabled={!has_tp_selected_value_ref.current}
                    decimals={decimals}
                    data-testid='dt_input_with_steppers'
                    inputMode='decimal'
                    message={should_show_be_error ? be_error_text : input_message}
                    minusDisabled={Number(tp_selected_value_ref.current) - 1 <= 0}
                    name='take_profit'
                    onChange={onInputChange}
                    placeholder={localize('Amount')}
                    ref={input_ref}
                    regex={/[^0-9.,]/g}
                    status={should_show_be_error ? 'error' : 'neutral'}
                    textAlignment='center'
                    unitLeft={currency_display_code}
                    variant='fill'
                    value={tp_selected_value_ref.current}
                />
                {!has_tp_selected_value_ref.current && (
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
            </ActionSheet.Content>
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

export default observer(TakeProfitInput);
