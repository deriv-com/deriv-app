import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { focusAndOpenKeyboard, getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { TTradeStore } from 'Types';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import useIsVirtualKeyboardOpen from 'AppV2/Hooks/useIsVirtualKeyboardOpen';
import useTradeError from 'AppV2/Hooks/useTradeError';
import { ExpandedProposal } from 'Stores/Modules/Trading/Helpers/proposal';

type TTakeProfitAndStopLossInputProps = {
    classname?: string;
    has_save_button?: boolean;
    has_actionsheet_wrapper?: boolean;
    initial_error_text?: React.ReactNode;
    onActionSheetClose: () => void;
    parent_ref?: React.MutableRefObject<{
        has_take_profit?: boolean;
        has_stop_loss?: boolean;
        take_profit?: string;
        tp_error_text?: string;
        stop_loss?: string;
        sl_error_text?: string;
    }>;
    parent_is_api_response_received_ref?: React.MutableRefObject<boolean>;
    type?: 'take_profit' | 'stop_loss';
};
type TOnProposalResponse = TTradeStore['onProposalResponse'];

const TakeProfitAndStopLossInput = ({
    classname,
    has_save_button = true,
    has_actionsheet_wrapper = true,
    initial_error_text,
    onActionSheetClose,
    parent_ref,
    parent_is_api_response_received_ref,
    type = 'take_profit',
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
    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);

    // For tracking errors, that are coming from proposal for take profit and stop loss
    const { message } = useTradeError({ error_fields: [type] });

    // For handling cases when user clicks on Save btn before we got response from API
    const is_api_response_received = React.useRef(false);
    const is_api_response_received_ref = parent_is_api_response_received_ref || is_api_response_received;

    const [is_enabled, setIsEnabled] = React.useState(is_take_profit_input ? has_take_profit : has_stop_loss);
    const [new_input_value, setNewInputValue] = React.useState(is_take_profit_input ? take_profit : stop_loss);
    const [error_text, setErrorText] = React.useState('');
    const [fe_error_text, setFEErrorText] = React.useState(initial_error_text ?? message ?? '');
    const [max_length, setMaxLength] = React.useState(10);

    // Refs for handling focusing and bluring input
    const input_ref = React.useRef<HTMLInputElement>(null);
    const focused_input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const decimals = getDecimalPlaces(currency);
    const currency_display_code = getCurrencyDisplayCode(currency);
    const Component = has_actionsheet_wrapper ? ActionSheet.Content : 'div';

    const min_value = validation_params[contract_types[0]]?.[type]?.min;
    const max_value = validation_params[contract_types[0]]?.[type]?.max;
    // Storing data from validation params (proposal) in state in case if we got a validation error from API and proposal stop streaming
    const [info, setInfo] = React.useState<Record<string, string | undefined>>({ min_value, max_value });

    const new_values = {
        ...(is_take_profit_input ? { has_take_profit: is_enabled } : { has_stop_loss: is_enabled }),
        has_cancellation: false,
        ...(is_take_profit_input
            ? { take_profit: is_enabled ? new_input_value : '' }
            : { stop_loss: is_enabled ? new_input_value : '' }),
    };

    const proposal_req = getProposalRequestObject({
        new_values,
        trade_store,
        trade_type: Object.keys(trade_types)[0],
    });

    // We need to exclude tp in case if type === sl and vise versa in limit order to validate them independently
    if (is_take_profit_input && proposal_req.limit_order?.stop_loss) {
        delete proposal_req.limit_order.stop_loss;
    }
    if (!is_take_profit_input && proposal_req.limit_order?.take_profit) {
        delete proposal_req.limit_order.take_profit;
    }

    const { data: response } = useDtraderQuery<Parameters<TOnProposalResponse>[0]>(
        [
            'proposal',
            ...Object.entries(new_values).flat().join('-'),
            Object.keys(trade_types)[0],
            JSON.stringify(proposal_req),
        ],
        proposal_req,
        {
            enabled: is_enabled,
        }
    );

    const input_message =
        info.min_value && info.max_value ? (
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

    const updateParentRef = ({ field_name, new_value }: { field_name: string; new_value: React.ReactNode }) => {
        if (!parent_ref?.current || !field_name) return;
        parent_ref.current = { ...parent_ref.current, [field_name]: new_value };
    };

    const onToggleSwitch = (new_value: boolean) => {
        is_api_response_received_ref.current = false;
        setIsEnabled(new_value);
        updateParentRef({ field_name: is_take_profit_input ? 'has_take_profit' : 'has_stop_loss', new_value });

        if (new_value) {
            clearTimeout(focus_timeout.current);
            focus_timeout.current = focusAndOpenKeyboard(focused_input_ref.current, input_ref.current);
        } else {
            setFEErrorText('');
            setErrorText('');
            updateParentRef({ field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text', new_value: '' });
            input_ref.current?.blur();
        }
    };

    React.useEffect(() => {
        const onProposalResponse: TOnProposalResponse = response => {
            const { error, proposal } = response;

            const new_error = error?.message ?? '';
            const is_error_field_match = error?.details?.field === type || !error?.details?.field;
            setErrorText(is_error_field_match ? new_error : '');
            updateParentRef({
                field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text',
                new_value: is_error_field_match ? new_error : '',
            });

            // Recovery for min and max allowed values in case of error
            if (!info.min_value || !info.max_value) {
                const { min, max } = (proposal as ExpandedProposal)?.validation_params?.[type] ?? {};
                setInfo(info =>
                    (info.min_value !== min && min) || (info.max_value !== max && max)
                        ? { min_value: min, max_value: max }
                        : info
                );
            }
            is_api_response_received_ref.current = true;
        };

        if (response) onProposalResponse(response);
    }, [is_enabled, response]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = String(e.target.value);
        if (value.length > 1) value = /^[0-]+$/.test(value) ? '0' : value.replace(/^0*/, '').replace(/^\./, '0.');

        // If new value is equal to previous one, then we won't send API request
        const is_equal = value === new_input_value;
        is_api_response_received_ref.current = is_equal;
        if (is_equal) return;
        setFEErrorText('');
        setNewInputValue(value);
        updateParentRef({ field_name: type, new_value: value });
    };

    const onSave = () => {
        // Prevent from saving if user clicks before BE validation
        if (!is_api_response_received_ref.current && is_enabled) return;

        if (error_text && is_enabled) return;
        if (!new_input_value && is_enabled) {
            setFEErrorText(
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

    // scroll the page when a virtual keyboard pop up
    const { is_key_board_visible: should_scroll } = useIsVirtualKeyboardOpen(type);

    React.useEffect(() => {
        if (should_scroll) window?.scrollTo({ top: 225, behavior: 'smooth' });
    }, [should_scroll]);

    React.useEffect(() => {
        setFEErrorText(initial_error_text ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initial_error_text]);

    React.useEffect(() => {
        setInfo(info =>
            (info.min_value !== min_value && min_value) || (info.max_value !== max_value && max_value)
                ? { min_value, max_value }
                : info
        );
    }, [min_value, max_value]);

    React.useEffect(() => () => clearTimeout(focus_timeout.current), []);

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
                    customType='commaRemoval'
                    className='text-field--custom'
                    disabled={!is_enabled}
                    decimals={decimals}
                    data-testid={is_take_profit_input ? 'dt_tp_input' : 'dt_sl_input'}
                    inputMode='decimal'
                    id={type}
                    message={is_enabled && (fe_error_text || error_text || input_message)}
                    minusDisabled={Number(new_input_value) - 1 <= 0}
                    name={type}
                    noStatusIcon
                    onChange={onInputChange}
                    placeholder={localize('Amount')}
                    ref={input_ref}
                    regex={/[^0-9.,]/g}
                    status={fe_error_text || error_text ? 'error' : 'neutral'}
                    shouldRound={false}
                    textAlignment='center'
                    unitLeft={currency_display_code}
                    variant='fill'
                    value={new_input_value ?? ''}
                    onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
                        if (
                            ['.', ','].includes((e.nativeEvent as InputEvent)?.data ?? '') &&
                            (new_input_value?.length ?? 0) <= 10
                        ) {
                            setMaxLength(decimals ? 11 + decimals : 10);
                        } else if (!new_input_value?.includes('.')) {
                            setMaxLength(10);
                        }
                    }}
                    maxLength={max_length}
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
