import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_TYPES, getCurrencyDisplayCode, getDecimalPlaces, WS } from '@deriv/shared';
import { focusAndOpenKeyboard } from 'AppV2/Utils/trade-params-utils';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { requestPreviewProposal } from 'Stores/Modules/Trading/Helpers/preview-proposal';
import { TTradeStore } from 'Types';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';

type TTakeProfitAndStopLossInputProps = {
    classname?: string;
    has_save_button?: boolean;
    initial_error_text?: string;
    onActionSheetClose: () => void;
    parent_subscription_id_ref?: React.MutableRefObject<string | undefined>;
    parent_ref?: React.MutableRefObject<{
        has_take_profit?: boolean;
        take_profit?: string;
        has_stop_loss?: boolean;
        stop_loss?: string;
        tp_error_text?: string;
        sl_error_text?: string;
    }>;
    type?: 'take_profit' | 'stop_loss';
    should_wrap_with_actionsheet?: boolean;
    show_acceptable_range?: boolean;
};

const TakeProfitAndStopLossInput = ({
    classname,
    has_save_button = true,
    initial_error_text,
    onActionSheetClose,
    parent_subscription_id_ref,
    parent_ref,
    type = 'take_profit',
    should_wrap_with_actionsheet = true,
    show_acceptable_range = true,
}: TTakeProfitAndStopLossInputProps) => {
    const trade_store = useTraderStore();
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
        validation_params,
    } = trade_store;

    const is_take_profit_input = type === 'take_profit';
    const subscription_id = React.useRef<string>();
    const subscription_id_ref = parent_subscription_id_ref || subscription_id;
    const [is_enabled, setIsEnabled] = React.useState<boolean>(is_take_profit_input ? has_take_profit : has_stop_loss);
    const [new_input_value, setNewInputValue] = React.useState(is_take_profit_input ? take_profit : stop_loss);
    const [error_text, setErrorText] = React.useState<string>(initial_error_text ?? '');

    // Refs for handling focusing and bluring
    const input_ref = React.useRef<HTMLInputElement>(null);
    const focused_input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const decimals = getDecimalPlaces(currency);
    const currency_display_code = getCurrencyDisplayCode(currency);
    const Component = should_wrap_with_actionsheet ? ActionSheet.Content : 'div';

    const min_value = is_take_profit_input
        ? validation_params[contract_types[0]]?.take_profit?.min
        : validation_params[contract_types[0]]?.stop_loss?.min;
    const max_value = is_take_profit_input
        ? validation_params[contract_types[0]]?.take_profit?.max
        : validation_params[contract_types[0]]?.stop_loss?.max;
    // Storing data from validation params (proposal) in state in case if we got a validation error from BE and proposal stop streaming
    const [info, setInfo] = React.useState<Record<string, string | undefined>>({
        min_value,
        max_value,
    });

    const input_message =
        info.min_value && info.max_value && is_enabled && show_acceptable_range ? (
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

    React.useEffect(() => {
        if (!is_enabled) {
            WS.forget(subscription_id_ref.current);
            return;
        }

        const onProposalResponse: TTradeStore['onProposalResponse'] = response => {
            const { proposal, echo_req, error, subscription } = response;
            if (echo_req.contract_type === CONTRACT_TYPES.MULTIPLIER.DOWN) {
                return;
            }
            if (!is_enabled) {
                WS.forget(subscription?.id);
                return;
            }
            if (subscription?.id) subscription_id_ref.current = subscription?.id;

            const error_details_field = is_take_profit_input ? 'take_profit' : 'stop_loss';
            const new_error = error?.details?.field === error_details_field ? error?.message : '';
            setErrorText(new_error);
            updateParentRef({
                field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text',
                new_value: new_error,
            });
            if (error?.message) WS.forget(subscription?.id);

            // if (
            //     isMounted() &&
            //     proposal
            // echo_req.contract_type === CONTRACT_TYPES.MULTIPLIER.UP
            // echo_req?.limit_order?.take_profit === has_selected_value_ref.current
            // ) {
            // console.log('proposal', proposal);
            // const { validation_params } = proposal as ExpandedProposal;
            // setInfo(take_profit => {
            //     if (
            //         (take_profit.min_value !== validation_params?.take_profit?.min &&
            //             validation_params?.take_profit?.min) ||
            //         (take_profit.max_value !== validation_params?.take_profit?.max &&
            //             validation_params?.take_profit?.max)
            //     ) {
            //         return {
            //             min_value: validation_params?.take_profit?.max,
            //             max_value: validation_params?.take_profit?.min,
            //         };
            //     }
            //     return take_profit;
            // });
            // }
        };

        const dispose = requestPreviewProposal(
            trade_store,
            onProposalResponse,
            {
                ...(is_take_profit_input ? { has_take_profit: is_enabled } : { has_stop_loss: is_enabled }),
                ...(is_take_profit_input
                    ? { take_profit: is_enabled ? new_input_value : '' }
                    : { stop_loss: is_enabled ? new_input_value : '' }),
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

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = String(e.target.value).replace(',', '.');
        if (value.startsWith('.')) {
            value = value.replace(/^\./, '0.');
        }
        if (value.length > 1) {
            value = /^[0-]+$/.test(value) ? '0' : value.replace(/^0*/, '').replace(/^\./, '0.');
        }

        setNewInputValue(value);
        updateParentRef({ field_name: is_take_profit_input ? 'take_profit' : 'stop_loss', new_value: value });
    };

    const onSave = () => {
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
