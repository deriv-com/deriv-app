import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_TYPES, getCurrencyDisplayCode, getDecimalPlaces, useIsMounted, WS } from '@deriv/shared';
import { focusAndOpenKeyboard } from 'AppV2/Utils/trade-params-utils';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { requestPreviewProposal } from 'Stores/Modules/Trading/Helpers/preview-proposal';
import { TTradeStore } from 'Types';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { ExpandedProposal } from 'Stores/Modules/Trading/Helpers/proposal';

type TTakeProfitAndStopLossInputProps = {
    classname?: string;
    has_save_button?: boolean;
    initial_error_text?: string;
    onActionSheetClose: () => void;
    parent_subscription_id_ref?: React.MutableRefObject<string | undefined>;
    parent_ref?: React.MutableRefObject<{
        has_take_profit?: boolean;
        has_stop_loss?: boolean;
        take_profit?: string;
        tp_error_text?: string;
        stop_loss?: string;
        sl_error_text?: string;
    }>;
    parent_is_be_response_received_ref?: React.MutableRefObject<boolean>;
    type?: 'take_profit' | 'stop_loss';
    should_wrap_with_actionsheet?: boolean;
};

const TakeProfitAndStopLossInput = ({
    classname,
    has_save_button = true,
    initial_error_text,
    onActionSheetClose,
    parent_subscription_id_ref,
    parent_ref,
    parent_is_be_response_received_ref,
    type = 'take_profit',
    should_wrap_with_actionsheet = true,
}: TTakeProfitAndStopLossInputProps) => {
    const trade_store = useTraderStore();
    const {
        contract_type,
        currency,
        has_take_profit,
        has_stop_loss,
        is_accumulator,
        is_multiplier,
        take_profit,
        stop_loss,
        trade_types,
        trade_type_tab,
        onChangeMultiple,
        validation_params,
    } = trade_store;
    const isMounted = useIsMounted();

    const is_take_profit_input = type === 'take_profit';

    const subscription_id = React.useRef<string>();
    const subscription_id_ref = parent_subscription_id_ref || subscription_id;

    // For handling cases when user clicks on Save btn before we got response from BE
    const is_be_response_received = React.useRef(false);
    const is_be_response_received_ref = parent_is_be_response_received_ref || is_be_response_received;

    const [is_enabled, setIsEnabled] = React.useState(is_take_profit_input ? has_take_profit : has_stop_loss);
    const [new_input_value, setNewInputValue] = React.useState(is_take_profit_input ? take_profit : stop_loss);
    const [error_text, setErrorText] = React.useState(initial_error_text ?? '');

    // Refs for handling focusing and bluring input
    const input_ref = React.useRef<HTMLInputElement>(null);
    const focused_input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const decimals = getDecimalPlaces(currency);
    const currency_display_code = getCurrencyDisplayCode(currency);
    const Component = should_wrap_with_actionsheet ? ActionSheet.Content : 'div';
    const should_set_validation_params = is_multiplier && is_enabled && new_input_value === '';

    const min_value = validation_params[contract_types[0]]?.[type]?.min;
    const max_value = validation_params[contract_types[0]]?.[type]?.max;
    // Storing data from validation params (proposal) in state in case if we got a validation error from BE and proposal stop streaming
    const [info, setInfo] = React.useState<Record<string, string | undefined>>({ min_value, max_value });

    const input_message =
        info.min_value && info.max_value && is_enabled ? (
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

    const updateParentRef = ({ field_name, new_value }: { field_name: string; new_value: string | boolean }) => {
        if (!parent_ref?.current || !field_name) return;
        parent_ref.current = { ...parent_ref.current, [field_name]: new_value };
    };

    const onToggleSwitch = (new_value: boolean) => {
        is_be_response_received_ref.current = false;
        setIsEnabled(new_value);
        updateParentRef({ field_name: is_take_profit_input ? 'has_take_profit' : 'has_stop_loss', new_value });

        if (new_value) {
            clearTimeout(focus_timeout.current);
            focus_timeout.current = focusAndOpenKeyboard(focused_input_ref.current, input_ref.current);
        } else {
            setErrorText('');
            updateParentRef({ field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text', new_value: '' });
            input_ref.current?.blur();
        }
    };

    // We are using requestPreviewProposal in useEffect in order to validate both fields independently
    React.useEffect(() => {
        if (!is_enabled) {
            WS.forget(subscription_id_ref.current);
            return;
        }

        const onProposalResponse: TTradeStore['onProposalResponse'] = response => {
            const { proposal, echo_req, error, subscription } = response;
            // For multipliers we got 2 responses (Up and Down); the 2d one is not needed as it will be difficult to clean it when user clicks on Save btn
            if (echo_req.contract_type === CONTRACT_TYPES.MULTIPLIER.DOWN) {
                WS.forget(subscription?.id);
                is_be_response_received_ref.current = true;
                return;
            }
            if (!is_enabled) {
                WS.forget(subscription?.id);
                is_be_response_received_ref.current = true;
                return;
            }
            if (subscription?.id) subscription_id_ref.current = subscription?.id;

            const new_error = error?.details?.field === type ? error?.message : '';
            setErrorText(new_error);
            updateParentRef({
                field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text',
                new_value: new_error,
            });
            if (error?.message) WS.forget(subscription?.id);

            /* For Multipliers, validation parameters come in proposal response only if TP or SL are switched on and their value is not empty.
            Here we set them into the state in order to show further even if we got a validation error from BE.*/
            if (
                isMounted() &&
                proposal &&
                echo_req.contract_type === CONTRACT_TYPES.MULTIPLIER.UP &&
                (echo_req?.limit_order?.take_profit || echo_req?.limit_order?.stop_loss)
            ) {
                const { validation_params } = proposal as ExpandedProposal;
                setInfo(info => {
                    if (
                        (info.min_value !== validation_params?.[type]?.min && validation_params?.[type]?.min) ||
                        (info.max_value !== validation_params?.[type]?.max && validation_params?.[type]?.max)
                    ) {
                        return {
                            min_value: validation_params?.[type]?.min,
                            max_value: validation_params?.[type]?.max,
                        };
                    }
                    return info;
                });
            }
            is_be_response_received_ref.current = true;
        };

        /* In order to get validation params for Multipliers when TP and SL are empty, 
            we send '1' first, get validation params and set them into the state.*/
        const input_value = should_set_validation_params ? '1' : new_input_value;
        const dispose = requestPreviewProposal(
            trade_store,
            onProposalResponse,
            {
                ...(is_take_profit_input ? { has_take_profit: is_enabled } : { has_stop_loss: is_enabled }),
                ...(is_take_profit_input
                    ? { take_profit: is_enabled ? input_value : '' }
                    : { stop_loss: is_enabled ? input_value : '' }),
            },
            true
        );

        return () => {
            dispose?.();
            WS.forget(subscription_id_ref.current);
            clearTimeout(focus_timeout.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_enabled, new_input_value]);

    // TODO: remove all regex replacement, when comma will be supported by quill component with type number
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        is_be_response_received_ref.current = false;
        let value = String(e.target.value)
            .replace(',', '.')
            .replace(/[.](?!\d*$)/g, '');
        if (value.startsWith('.')) {
            value = value.replace(/^\./, '0.');
        }
        if (value.length > 1) {
            value = /^[0-]+$/.test(value) ? '0' : value.replace(/^0*/, '').replace(/^\./, '0.');
        }

        setNewInputValue(value);
        updateParentRef({ field_name: type, new_value: value });
    };

    const onSave = () => {
        // Prevent from saving if user clicks before BE validation
        if (!is_be_response_received_ref.current && is_enabled) return;
        WS.forget(subscription_id_ref.current);

        if (error_text && is_enabled) return;
        if (new_input_value === '' && is_enabled) {
            setErrorText(
                is_take_profit_input
                    ? localize('Please enter a take profit amount.')
                    : localize('Please enter a stop loss amount.')
            );
            return;
        }

        const is_tp_enabled = error_text ? false : is_enabled;
        onChangeMultiple({
            ...(is_take_profit_input ? { has_take_profit: is_tp_enabled } : { has_stop_loss: is_tp_enabled }),
            ...(is_take_profit_input
                ? {
                      take_profit: error_text || new_input_value === '0' ? '' : new_input_value,
                  }
                : {
                      stop_loss: error_text || new_input_value === '0' ? '' : new_input_value,
                  }),
            ...(is_tp_enabled ? { has_cancellation: false } : {}),
        });
        onActionSheetClose();
    };

    React.useEffect(() => {
        setErrorText(initial_error_text ?? '');
        updateParentRef({
            field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text',
            new_value: initial_error_text ?? '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initial_error_text]);

    React.useEffect(() => {
        setInfo(info =>
            (info.min_value !== min_value && min_value) || (info.max_value !== max_value && max_value)
                ? { min_value, max_value }
                : info
        );
    }, [min_value, max_value]);

    return (
        <React.Fragment>
            <Component className={clsx('take-profit__wrapper', classname)}>
                <div className='take-profit__content'>
                    <Text>
                        {is_take_profit_input ? (
                            <Localize i18n_default_text='Take profit' />
                        ) : (
                            <Localize i18n_default_text='Stop loss' />
                        )}
                    </Text>
                    <ToggleSwitch checked={is_enabled} onChange={onToggleSwitch} />
                </div>
                <TextFieldWithSteppers
                    allowDecimals
                    disabled={!is_enabled}
                    decimals={decimals}
                    data-testid='dt_input_with_steppers'
                    inputMode='decimal'
                    message={error_text || input_message}
                    minusDisabled={Number(new_input_value) - 1 <= 0}
                    name={type}
                    onChange={onInputChange}
                    placeholder={localize('Amount')}
                    ref={input_ref}
                    regex={/[^0-9.,]/g}
                    status={error_text ? 'error' : 'neutral'}
                    textAlignment='center'
                    unitLeft={currency_display_code}
                    variant='fill'
                    value={new_input_value}
                />
                {!is_enabled && (
                    <button
                        className='take-profit__overlay'
                        data-testid='dt_take_profit_overlay'
                        onClick={() => onToggleSwitch(true)}
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
