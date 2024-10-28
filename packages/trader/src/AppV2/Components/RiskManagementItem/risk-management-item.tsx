import React from 'react';
import { ActionSheet, Text, TextField, TextFieldWithSteppers, ToggleSwitch } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import RiskManagementInfoModal from '../RiskManagementInfoModal';
import DealCancellationRemainingTime from '../DealCancellationRemainingTime/deal-cancellation-remaining-time';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import {
    CONTRACT_TYPES,
    formatMoney,
    isAccumulatorContract,
    isValidToCancel,
    getDecimalPlaces,
    getCurrencyDisplayCode,
} from '@deriv/shared';
import TotalProfitLoss from '../TotalProfitLoss';
import { getProfit } from 'AppV2/Utils/positions-utils';

type RiskManagementItemProps = {
    label: React.ReactNode;
    modal_body_content: React.ReactNode;
    is_deal_cancellation?: boolean;
    value?: number | null;
    type?: 'take_profit' | 'stop_loss';
};

const RiskManagementItem = observer(
    ({
        label,
        modal_body_content,
        is_deal_cancellation = false,
        value,
        type,
    }: RiskManagementItemProps) => {
        const [isToggleOn, setIsToggleOn] = React.useState(Boolean(value));
        const [isSheetOpen, setIsSheetOpen] = React.useState(false);
        const [isEnabled, setIsEnabled] = React.useState(false);
        const [stepperValue, setStepperValue] = React.useState<number | string>();
        const { contract_info, contract } = useContractDetails();
        const { contract_type, currency, validation_params } = contract_info;
        const { validation_errors, updateLimitOrder, clearContractUpdateConfigValues } = contract;
        const is_valid_to_cancel = isValidToCancel(contract_info);
        const is_accumulator = isAccumulatorContract(contract_type);
        const total_profit = getProfit(contract_info);

        React.useEffect(() => {
            if (value) {
                setStepperValue(value);
                setIsToggleOn(Boolean(value));
            }
            return () => clearContractUpdateConfigValues();
        }, [clearContractUpdateConfigValues, value]);

        const isDealCancellation = is_valid_to_cancel;
        const finalValue = Math.abs(value as number);

        const errorKey = `contract_update_${type}` as 'contract_update_stop_loss' | 'contract_update_take_profit';
        const validation_error_message = validation_errors[errorKey]?.[0] ?? '';

        const messageForMultiplier = is_valid_to_cancel ? (
            <Localize i18n_default_text='Take profit and/or stop loss are not available while deal cancellation is active.' />
        ) : null;

        const info_message = {
            [CONTRACT_TYPES.ACCUMULATOR]: (
                <Localize i18n_default_text='Take profit can’t be adjusted for ongoing accumulator contracts.' />
            ),
            [CONTRACT_TYPES.MULTIPLIER.UP]: messageForMultiplier,
            [CONTRACT_TYPES.MULTIPLIER.DOWN]: messageForMultiplier,
        };

        const onChange = (
            e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: number | string | boolean } }
        ) => {
            const { value } = e.target;
            setStepperValue(value as number);
            contract.onChange?.({
                name: `contract_update_${type}`,
                value,
            });
        };

        const handleToggleSwitch = (value: boolean) => {
            clearContractUpdateConfigValues();
            if (value) {
                setIsSheetOpen(true);
                setStepperValue('');
                setIsEnabled(true);
            } else {
                contract.onChange?.({
                    name: `has_contract_update_${type}`,
                    value,
                });
                updateLimitOrder();
                setIsToggleOn(!isToggleOn);
            }
        };

        const onSave = () => {
            if (error_message) return;
            if (isEnabled) {
                contract.onChange?.({
                    name: `has_contract_update_${type}`,
                    value: true,
                });
                setIsEnabled(false);
            }
            updateLimitOrder();
            setIsSheetOpen(false);
        };

        const min_value = type && (validation_params?.[type]?.min ?? 0);
        const max_value = type && (validation_params?.[type]?.max ?? 0);

        const error_message = (() => {
            const field_label = type === 'take_profit' ? localize('take profit') : localize('stop loss');
            if (stepperValue && min_value && +stepperValue < +min_value) {
                return localize('Please enter a {{field_label}} amount that’s at least {{min_value}}.', {
                    field_label,
                    min_value,
                });
            }
            if (stepperValue && max_value && +stepperValue > +max_value) {
                return localize('Maximum {{field_label}} allowed is {{max_value}}.', {
                    field_label,
                    max_value,
                });
            }
            return validation_error_message;
        })();

        return (
            <div className='risk-management-item__container'>
                <div className='risk-management-item'>
                    <span className='risk-management-item__title'>
                        <Text size='sm'>{label}</Text>
                        <RiskManagementInfoModal
                            header_content={label}
                            body_content={modal_body_content}
                            info_message={info_message[contract_type as keyof typeof info_message] || ''}
                        />
                    </span>
                    {!is_deal_cancellation &&
                        (is_accumulator && currency ? (
                            <Text size='sm'>
                                {formatMoney(currency, finalValue, true)} {currency}
                            </Text>
                        ) : (
                            <ToggleSwitch
                                disabled={isDealCancellation}
                                checked={isToggleOn}
                                onChange={handleToggleSwitch}
                            />
                        ))}
                    {is_valid_to_cancel && is_deal_cancellation && <DealCancellationRemainingTime />}
                </div>
                {!is_accumulator && isToggleOn && currency && (
                    <TextField
                        variant='fill'
                        inputSize='md'
                        disabled={isSheetOpen}
                        textAlignment='center'
                        value={`${formatMoney(
                            currency,
                            type == 'stop_loss' ? -finalValue : finalValue,
                            true
                        )} ${currency}`}
                        onClick={() => {
                            clearContractUpdateConfigValues();
                            setStepperValue(finalValue);
                            setIsSheetOpen(true);
                        }}
                        onFocus={() => setIsSheetOpen(true)}
                    />
                )}
                <ActionSheet.Root
                    expandable={false}
                    isOpen={isSheetOpen}
                    position='left'
                    onClose={() => {
                        setIsEnabled(false);
                        setIsSheetOpen(false);
                    }}
                >
                    <ActionSheet.Portal shouldCloseOnDrag>
                        <ActionSheet.Header title={label} />
                        <ActionSheet.Content className='risk-management-item__action-sheet-content'>
                            {isSheetOpen && (
                                <TextFieldWithSteppers
                                    allowDecimals
                                    allowSign={false}
                                    className='text-field--custom'
                                    customType='commaRemoval'
                                    decimals={getDecimalPlaces(currency)}
                                    message={error_message}
                                    minusDisabled={Number(stepperValue) - 1 <= 0}
                                    name={type}
                                    noStatusIcon
                                    onChange={onChange}
                                    placeholder={localize('Amount')}
                                    regex={/[^0-9.,]/g}
                                    status={error_message ? 'error' : 'neutral'}
                                    textAlignment='center'
                                    inputMode='decimal'
                                    unitLeft={getCurrencyDisplayCode(currency)}
                                    value={stepperValue}
                                    variant='fill'
                                />
                            )}
                            {!!total_profit && (
                                <TotalProfitLoss
                                    currency={getCurrencyDisplayCode(currency)}
                                    is_bold={false}
                                    totalProfitLoss={total_profit}
                                />
                            )}
                        </ActionSheet.Content>
                        <ActionSheet.Footer
                            shouldCloseOnPrimaryButtonClick={false}
                            primaryAction={{
                                content: <Localize i18n_default_text='Save' />,
                                onAction: onSave,
                            }}
                        />
                    </ActionSheet.Portal>
                </ActionSheet.Root>
            </div>
        );
    }
);
export default RiskManagementItem;
